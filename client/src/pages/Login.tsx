import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import authBg from "@/assets/auth-bg.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Welcome back!", description: "You're now logged in." });
    navigate("/");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={authBg}
          alt="Luxury beauty products flat lay"
          className="absolute inset-0 w-full h-full object-cover"
          width={1024}
          height={1536}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-background/40" />
        <div className="relative z-10 h-full flex flex-col justify-between p-10 text-foreground">
          <Link to="/" className="inline-flex items-center gap-2 w-fit">
            <Sparkles className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold tracking-tight">Fuzzy-Broccoli</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border max-w-md"
          >
            <h2 className="font-display text-3xl font-bold mb-2">Welcome back, beauty.</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to access your favorites, orders, and exclusive dupes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              <span className="font-display text-2xl font-bold tracking-tight">Fuzzy-Broccoli</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue shopping your favorites.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </div>

          <div className="text-center">
            <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-foreground">
              Admin Login →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
