import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, MeshWobbleMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const RotatingSphere = ({ position, color, speed, distort, size }: { position: [number, number, number]; color: string; speed: number; distort: number; size: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * speed * 0.3;
    ref.current.rotation.y += delta * speed * 0.5;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={ref} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial color={color} distort={distort} speed={3} roughness={0.2} metalness={0.8} />
      </Sphere>
    </Float>
  );
};

const FloatingTorus = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.4;
    ref.current.rotation.z += delta * 0.2;
  });
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Torus ref={ref} args={[0.8, 0.3, 32, 64]} position={position}>
        <MeshWobbleMaterial color={color} factor={0.4} speed={2} roughness={0.3} metalness={0.7} />
      </Torus>
    </Float>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 5, 5]} intensity={1} color="#ffd1dc" />
    <pointLight position={[-5, -5, 5]} intensity={0.8} color="#c4b5fd" />
    <pointLight position={[5, -5, -5]} intensity={0.5} color="#93c5fd" />
    <RotatingSphere position={[-3, 1.5, -2]} color="#f9a8d4" speed={0.8} distort={0.4} size={1.2} />
    <RotatingSphere position={[3.5, -1, -3]} color="#c4b5fd" speed={0.6} distort={0.3} size={1.5} />
    <RotatingSphere position={[0, 2.5, -4]} color="#93c5fd" speed={1} distort={0.5} size={0.8} />
    <RotatingSphere position={[-2, -2, -2]} color="#fde68a" speed={0.5} distort={0.35} size={0.6} />
    <FloatingTorus position={[2, 1, -1.5]} color="#f0abfc" />
    <FloatingTorus position={[-1.5, -1.5, -3]} color="#a5b4fc" />
  </>
);

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isSignUp ? "Account created!" : "Welcome back!",
      description: isSignUp ? "You can now start shopping." : "You're now logged in.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      {/* Overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-background/60 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10 bg-card/80 backdrop-blur-xl p-8 rounded-2xl border shadow-2xl"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold tracking-tight">Fuzzy-Broccoli</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignUp
              ? "Join the community and start saving on beauty"
              : "Sign in to your account to continue shopping"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
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
            <label className="text-sm font-medium text-foreground">Password</label>
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

          <Button type="submit" size="lg" className="w-full gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
            {isSignUp ? "Create Account" : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

        <div className="text-center">
          <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-foreground">
            Admin Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
