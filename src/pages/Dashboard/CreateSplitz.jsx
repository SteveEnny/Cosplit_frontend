// pages/CreateSplitzPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Camera, AlertCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateSplitMutation } from "../../services/queries/splits";
import { SplitFormSchema } from "../../schemas/splitSchemas";

const CreateSplitzPage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [includeMe, setIncludeMe] = useState(true);
  const [participantsCount, setParticipantsCount] = useState(4);
  const createSplitMutation = useCreateSplitMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(SplitFormSchema),
    defaultValues: {
      title: "",
      category: "",
      split_method: "SpecificAmounts",
      start_date: "2025-05-15",
      end_date: "2025-05-17",
      location: "Computer Village, Ikeja, Lagos",
      amount: 10000,
      max_participants: 4,
      visibility_radius: 5,
      rules: "Mandatory Refund Rule: A 5% charge applies if the split is canceled before 70% participation.",
    },
  });

  const categories = [
    { value: "", label: "Select Category" },
    { value: "Housing", label: "Housing" },
    { value: "Food & Groceries", label: "Food & Groceries" },
    { value: "Transportation", label: "Transportation" },
    { value: "Events & Tickets", label: "Events & Tickets" },
    { value: "Utilities", label: "Utilities" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Other", label: "Other" },
  ];

  const splitMethods = [
    {
      value: "SpecificAmounts",
      label: "Equal Split",
      description: "All participants pay the same amount",
    },
    {
      value: "CustomAmounts",
      label: "Custom Split",
      description: "Set custom amounts for each participant",
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("image_url", previewUrl);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const finalParticipants = includeMe
        ? Math.max(1, participantsCount - 1)
        : participantsCount;

      const cleanAmount =
        typeof formData.amount === "string"
          ? parseFloat(formData.amount.replace(/[^\d.]/g, ""))
          : formData.amount;

      const payload = {
        ...formData,
        amount: cleanAmount,
        max_participants: finalParticipants,
      };

      // Create the split via API
      const response = await createSplitMutation.mutateAsync(payload);

      // Navigate to payment page with ALL necessary data
      // No external API needed - all data passed via state
      navigate("/dashboard/payment", {
        state: {
          // Core split data from API response
          splitId: response.id,
          splitMethod: response.split_method,
          
          // Form data for display
          title: formData.title,
          amount: cleanAmount,
          category: formData.category,
          location: formData.location,
          startDate: formData.start_date,
          endDate: formData.end_date,
          
          // Calculated values
          participantsNeeded: finalParticipants,
          includeCreator: includeMe,
          perPersonAmount: Math.ceil(cleanAmount / (finalParticipants + (includeMe ? 1 : 0))),
          
          // Optional data
          imageUrl: imagePreview || formData.image_url,
          rules: formData.rules,
        },
      });
    } catch (error) {
      alert(error.message || "Failed to create split");
    }
  };

  const gotoAllTasks = () => navigate("/all-tasks");
  const selectedSplitMethod = watch("split_method");

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 lg:px-8 py-6">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={gotoAllTasks}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">View All Tasks</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
            Create Splittz
          </h1>
          <div className="w-6 sm:w-8 md:w-10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* SECTION: What are you splitting */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              What are you splitting?
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Split Title
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Shared Costco Groceries"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Split Category
              </label>
              <select
                {...register("category")}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image/Photo (Optional)
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-green-500">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <Camera size={20} className="text-gray-400" />
                </div>
                <div>
                  <span className="text-green-600 font-medium">Choose File</span>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 h-48 w-full object-cover rounded-lg"
                />
              )}
            </div>
          </section>

          {/* SECTION: Cost & Participants */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <h2 className="text-lg font-semibold">Cost and Participants</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Total Amount (₦)
              </label>
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Participants Needed (excluding you)
              </label>
              <input
                type="number"
                min={1}
                value={participantsCount}
                onChange={(e) => setParticipantsCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-3">
              {splitMethods.map((method) => (
                <button
                  type="button"
                  key={method.value}
                  onClick={() => setValue("split_method", method.value)}
                  className={`w-full p-3 border-2 rounded-lg text-left ${
                    selectedSplitMethod === method.value
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedSplitMethod === method.value
                          ? "bg-green-600 border-green-600"
                          : "border-gray-400"
                      }`}
                    />
                    <span className="font-medium">{method.label}</span>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">{method.description}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <input
                type="checkbox"
                checked={includeMe}
                onChange={(e) => setIncludeMe(e.target.checked)}
                className="w-4 h-4 accent-green-600"
              />
              <label className="text-sm font-medium">I want to be part of the split</label>
            </div>
          </section>

          {/* SECTION: Dates */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <h2 className="text-lg font-semibold">Start & End Period</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  {...register("start_date")}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.start_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">End Date</label>
                <input
                  type="date"
                  {...register("end_date")}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.end_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* SECTION: Location */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <h2 className="text-lg font-semibold">Location & Visibility</h2>
            <div>
              <label className="block text-sm mb-2">Location</label>
              <input
                type="text"
                {...register("location")}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Visibility Radius: {watch("visibility_radius")} km
              </label>
              <input
                type="range"
                min="0"
                max="10"
                {...register("visibility_radius", { valueAsNumber: true })}
                className="w-full"
              />
            </div>
          </section>

          {/* RULES & SAFETY */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <h2 className="text-lg font-semibold">Rules and Safety</h2>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded flex gap-3">
              <AlertCircle size={18} className="text-red-600" />
              <div>
                <h4 className="font-semibold text-red-700 text-sm">
                  Mandatory Refund Rule
                </h4>
                <p className="text-xs text-red-600">
                  A 5% charge applies if the split is canceled before 70% participation.
                </p>
              </div>
            </div>
            <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded flex gap-3">
              <Shield size={18} className="text-green-600" />
              <div>
                <h4 className="font-semibold text-green-700 text-sm">
                  Secure Payment Protection
                </h4>
                <p className="text-xs text-green-600">Always active for verified users.</p>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting || createSplitMutation.isPending}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-70"
          >
            {isSubmitting || createSplitMutation.isPending
              ? "Creating Splittz..."
              : "Create Splittz"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateSplitzPage;