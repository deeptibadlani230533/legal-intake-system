import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Briefcase,
  IndianRupee,
} from "lucide-react";

import Header from "../components/Header";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Intake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    caseTitle: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    category: "",
    incidentDate: "",
    opponentName: "",
    claimAmount: "",
  });

  const progressValue = (step / 3) * 100;

  const inputBase =
    "h-11 bg-slate-50/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-lg";

  const inputStyle = (field) =>
    errors[field]
      ? `${inputBase} border-red-500 focus:border-red-500 focus:ring-red-500/20`
      : inputBase;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.clientName.trim())
        newErrors.clientName = "Full legal name is required";

      if (!formData.clientEmail.trim())
        newErrors.clientEmail = "Email address is required";
      else if (!validateEmail(formData.clientEmail))
        newErrors.clientEmail = "Enter a valid email address";

      if (!formData.clientPhone.trim())
        newErrors.clientPhone = "Phone number is required";
      else if (!validatePhone(formData.clientPhone))
        newErrors.clientPhone = "Enter a valid 10-digit Indian number";

      if (!formData.clientAddress.trim())
        newErrors.clientAddress = "Address is required";
    }

    if (step === 2) {
      if (!formData.caseTitle.trim())
        newErrors.caseTitle = "Matter title is required";

      if (!formData.category.trim())
        newErrors.category = "Please select a legal category";

      if (!formData.incidentDate)
        newErrors.incidentDate = "Date of incident is required";
    }

    if (step === 3) {
      if (!formData.opponentName.trim())
        newErrors.opponentName = "Opposing party name is required";

      if (!formData.claimAmount)
        newErrors.claimAmount = "Claim amount is required";

      if (!formData.description.trim())
        newErrors.description = "Case narrative is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create case.");
        return;
      }

      toast.success("Case file created successfully");

      setTimeout(() => {
        navigate("/cases");
      }, 800);
    } catch {
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header title="Case Intake System" />

      <main className="flex-1 overflow-y-auto py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  New Matter Entry
                </h2>
                <p className="text-sm text-slate-500">
                  Complete the required information below.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Step {step} / 3
              </span>
            </div>
            <Progress value={progressValue} className="h-2 rounded-full" />
          </div>

          <Card className="shadow-xl border border-slate-200/60 rounded-2xl">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  {step === 1 && <ShieldCheck size={18} />}
                  {step === 2 && <Briefcase size={18} />}
                  {step === 3 && <IndianRupee size={18} />}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {step === 1 && "Client Verification"}
                    {step === 2 && "Case Classification"}
                    {step === 3 && "Financial & Summary"}
                  </CardTitle>
                  <CardDescription>
                    Fill in the required information carefully.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Full Legal Name
                        </Label>
                        <Input
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          className={inputStyle("clientName")}
                        />
                        <ErrorMsg field="clientName" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Contact Email
                          </Label>
                          <Input
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            className={inputStyle("clientEmail")}
                          />
                          <ErrorMsg field="clientEmail" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Phone Number
                          </Label>
                          <Input
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleChange}
                            className={inputStyle("clientPhone")}
                          />
                          <ErrorMsg field="clientPhone" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Permanent Address
                        </Label>
                        <Textarea
                          name="clientAddress"
                          value={formData.clientAddress}
                          onChange={handleChange}
                          className={`${inputStyle("clientAddress")} min-h-[100px]`}
                        />
                        <ErrorMsg field="clientAddress" />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Matter Title
                        </Label>
                        <Input
                          name="caseTitle"
                          value={formData.caseTitle}
                          onChange={handleChange}
                          className={inputStyle("caseTitle")}
                        />
                        <ErrorMsg field="caseTitle" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Legal Category
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => {
                              setFormData({ ...formData, category: value });
                              setErrors({ ...errors, category: "" });
                            }}
                          >
                            <SelectTrigger
                              className={
                                errors.category
                                  ? "border-red-500"
                                  : "border border-slate-200 rounded-lg h-11"
                              }
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Criminal Defense">
                                Criminal Defense
                              </SelectItem>
                              <SelectItem value="Civil Litigation">
                                Civil Litigation
                              </SelectItem>
                              <SelectItem value="Corporate Law">
                                Corporate Law
                              </SelectItem>
                              <SelectItem value="Property Law">
                                Property Law
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <ErrorMsg field="category" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Date of Incident
                          </Label>
                          <Input
                            type="date"
                            name="incidentDate"
                            value={formData.incidentDate}
                            onChange={handleChange}
                            className={inputStyle("incidentDate")}
                          />
                          <ErrorMsg field="incidentDate" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Opposing Party Name
                        </Label>
                        <Input
                          name="opponentName"
                          value={formData.opponentName}
                          onChange={handleChange}
                          className={inputStyle("opponentName")}
                        />
                        <ErrorMsg field="opponentName" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Claim Amount (₹)
                        </Label>
                        <Input
                          type="number"
                          name="claimAmount"
                          value={formData.claimAmount}
                          onChange={handleChange}
                          className={inputStyle("claimAmount")}
                        />
                        <ErrorMsg field="claimAmount" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Case Narrative
                        </Label>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className={`${inputStyle("description")} min-h-[120px]`}
                        />
                        <ErrorMsg field="description" />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(step - 1)}
                      disabled={step === 1}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {step < 3 ? (
                      <Button onClick={handleNext}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? "Processing..." : "Create Case File"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}