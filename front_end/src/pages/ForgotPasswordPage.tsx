import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]" style={{ background: "hsl(var(--primary))" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SignalAI</span>
        </div>

        <h2 className="text-2xl font-bold text-foreground text-center mb-2">Reset password</h2>
        <p className="text-muted-foreground text-center mb-8">Enter your email to receive a reset link</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="john@example.com" className="pl-9 bg-secondary border-border text-foreground" />
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11">Send Reset Link</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
