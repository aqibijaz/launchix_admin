/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm as useRefineForm, useOne, useNavigation } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, DollarSign, Calendar, Package, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PlanFormData {
  code: string;
  name: string;
  description?: string;
  currency: string;
  amount: number;
  intervalCount: number;
  interval: 'month' | 'year' | 'custom';
  maxBrands?: number;
  features?: string[];
  isActive: boolean;
  isPopular: boolean;
}

export const PlanForm = ({ action, id }: { action: "create" | "edit"; id?: string }) => {
  const { list } = useNavigation();
  const { onFinish } = useRefineForm({
    resource: "plans",
    action,
    id,
  });
  // Fetch existing data when editing
  const { result: planData, query: { isLoading: isLoadingPlan } } = useOne({
    resource: "plans",
    id: id || "",
    queryOptions: {
      enabled: action === "edit" && !!id,
    },
  });
  console.log('planData', planData)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setValue,
  } = useForm<PlanFormData>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      currency: "usd",
      amount: 0,
      intervalCount: 1,
      interval: "month",
      maxBrands: 0,
      features: [],
      isActive: true,
      isPopular: false,
    },
  });
  console.log('planData', planData)
  const plan = planData;

  // Load existing plan data when editing
  useEffect(() => {
    if (plan && action === "edit") {
      reset({
        code: plan.code || "",
        name: plan.name || "",
        description: plan.description || "",
        currency: plan.currency || "usd",
        amount: plan.amount || 0,
        intervalCount: plan.intervalCount || 1,
        interval: plan.interval || "month",
        maxBrands: plan.maxBrands || 0,
        features: plan.features || [],
        isActive: plan.isActive ?? true,
        isPopular: plan.isPopular ?? false,
      });
    }
  }, [plan, action, reset]);

  const handleFormSubmit = async (data: PlanFormData) => {
    await onFinish(data);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = features || [];
      setValue("features", [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = features || [];
    setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const isActive = watch("isActive");
  const isPopular = watch("isPopular");
  const interval = watch("interval");
  const features = watch("features") || [];

  const [featureInput, setFeatureInput] = useState("");

  if (action === "edit" && isLoadingPlan) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="py-20">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-blue"></div>
                <span className="text-lg text-muted-foreground">Loading plan...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => list("plans")}
            className="hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-violet">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              {action === "create" ? "Create New Plan" : "Edit Plan"}
            </CardTitle>
            <p className="text-blue-400 mt-2">
              {action === "create"
                ? "Define a new subscription plan for your platform"
                : "Update the plan details and settings"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold  flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <span className="text-brand-blue font-bold text-sm">1</span>
                  </div>
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Plan Code *
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g., starter, pro, enterprise"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                      {...register("code", { required: "Code is required" })}
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500">{errors.code.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Plan Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Starter Plan"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div className="pl-10 space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the plan"
                    className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                    {...register("description")}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold  flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-violet/10 flex items-center justify-center">
                    <span className="text-brand-violet font-bold text-sm">2</span>
                  </div>
                  Pricing Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Currency *
                    </Label>
                    <Input
                      id="currency"
                      placeholder="usd"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue uppercase"
                      {...register("currency", { required: "Currency is required" })}
                    />
                    {errors.currency && (
                      <p className="text-sm text-red-500">{errors.currency.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium">
                      Amount (in cents) *
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="900 = $9.00"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                      {...register("amount", {
                        required: "Amount is required",
                        valueAsNumber: true,
                        min: { value: 0, message: "Amount must be positive" }
                      })}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Cycle Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold  flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  Billing Cycle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="interval" className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Interval *
                    </Label>
                    <Select
                      value={interval}
                      onValueChange={(value) => setValue("interval", value as 'month' | 'year' | 'custom')}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue w-full">
                        <SelectValue placeholder="Select billing interval" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intervalCount" className="text-sm font-medium">
                      Interval Count *
                    </Label>
                    <Input
                      id="intervalCount"
                      type="number"
                      placeholder="1"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                      {...register("intervalCount", {
                        required: "Interval count is required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Must be at least 1" }
                      })}
                    />
                    {errors.intervalCount && (
                      <p className="text-sm text-red-500">{errors.intervalCount.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold  flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  Plan Features
                </h3>

                <div className="pl-10 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxBrands" className="text-sm font-medium">
                      Maximum Brands Allowed
                    </Label>
                    <Input
                      id="maxBrands"
                      type="number"
                      placeholder="2"
                      className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue max-w-xs"
                      {...register("maxBrands", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of brands users can create with this plan
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Features List
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Logo generation, Brand colors..."
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={handleFeatureKeyPress}
                        className="border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                      />
                      <Button
                        type="button"
                        onClick={addFeature}
                        size="sm"
                        className="btn-brand shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {features.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2 border border-slate-200 group hover:border-brand-blue transition-colors"
                          >
                            <span className="text-sm">{feature}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Add features that are included in this plan (e.g., "2 brand identities", "Logo generation")
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold  flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">5</span>
                  </div>
                  Plan Settings
                </h3>

                <div className="pl-10 space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-brand-blue transition-colors">
                    <div className="space-y-1">
                      <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                        Active Plan
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make this plan available for users to purchase
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-brand-violet transition-colors">
                    <div className="space-y-1">
                      <Label htmlFor="isPopular" className="text-sm font-medium cursor-pointer">
                        Popular Plan
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Feature this plan with a "Popular" badge
                      </p>
                    </div>
                    <Switch
                      id="isPopular"
                      checked={isPopular}
                      onCheckedChange={(checked) => setValue("isPopular", checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => list("plans")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-brand shadow-lg hover:shadow-xl transition-shadow"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {action === "create" ? "Create Plan" : "Update Plan"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};