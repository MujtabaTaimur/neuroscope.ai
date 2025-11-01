import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Brain, Zap, Network, Twitter, Linkedin, Github, Check } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Advanced Neural Mesh Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const nodes = [];
    const nodeCount = 80;
    const connectionDistance = 200;
    const mouseInfluence = 100;

    class NeuralNode {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.5 + 0.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.01;
        this.baseOpacity = Math.random() * 0.3 + 0.2;
      }

      update(mouseX, mouseY) {
        // Drift
        this.x += this.vx;
        this.y += this.vy;

        // Boundary
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseInfluence) {
          const force = (1 - dist / mouseInfluence) * 0.05;
          this.x += dx * force;
          this.y += dy * force;
        }

        // Pulse
        this.pulsePhase += this.pulseSpeed;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const opacity = this.baseOpacity + pulse * 0.3;
        
        // Gradient from blue to violet
        const color = pulse > 0.5 ? 
          `rgba(43, 89, 255, ${opacity})` : 
          `rgba(123, 62, 255, ${opacity})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new NeuralNode());
    }

    let animationFrame;
    function animate() {
      ctx.fillStyle = 'rgba(15, 15, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = (mousePosition.x / 100) * canvas.width;
      const mouseY = (mousePosition.y / 100) * canvas.height;

      nodes.forEach((node, i) => {
        node.update(mouseX, mouseY);
        node.draw();

        // Neural connections
        nodes.slice(i + 1).forEach(other => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, `rgba(43, 89, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(123, 62, 255, ${opacity})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.integrations.Core.SendEmail({
        to: "hello@neuroscopes.com",
        subject: "NeuroScale Waitlist Signup",
        body: `New waitlist signup:\n\nName: ${name}\nEmail: ${email}\n\nTimestamp: ${new Date().toISOString()}`
      });

      setSubmitted(true);
      toast.success("Welcome to the neural network. You'll be notified at launch.");
      setEmail("");
      setName("");
    } catch (error) {
      console.error(error);
      toast.error("Connection failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f14] text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes neural-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes glow-breath {
          0%, 100% { box-shadow: 0 0 20px rgba(43, 89, 255, 0.2), 0 0 40px rgba(123, 62, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(43, 89, 255, 0.4), 0 0 60px rgba(123, 62, 255, 0.2); }
        }

        @keyframes float-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .neural-pulse {
          animation: neural-pulse 3s ease-in-out infinite;
        }

        .glow-breath {
          animation: glow-breath 4s ease-in-out infinite;
        }

        .float-in {
          animation: float-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .neural-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .neural-card:hover {
          background: rgba(43, 89, 255, 0.05);
          border-color: rgba(43, 89, 255, 0.3);
          transform: translateY(-8px);
        }

        .text-shimmer {
          background: linear-gradient(90deg, #cfcfcf 0%, #ffffff 50%, #cfcfcf 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 4s linear infinite;
        }

        .neural-gradient {
          background: radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(43, 89, 255, 0.12) 0%,
            rgba(123, 62, 255, 0.06) 40%,
            transparent 70%
          );
        }

        .section-label {
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        input:focus {
          outline: none;
          border-color: rgba(43, 89, 255, 0.5);
          box-shadow: 0 0 20px rgba(43, 89, 255, 0.2);
        }
      `}</style>

      {/* Neural Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Dynamic Mouse Gradient */}
      <div className="fixed inset-0 z-0 neural-gradient pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Section 1: Hero */}
        <section className="min-h-screen flex items-center justify-center px-6 relative">
          <div className="max-w-6xl mx-auto text-center">
            <div className="section-label text-[#cfcfcf] mb-8 float-in" style={{ animationDelay: '0.1s' }}>
              NeuroScale · Autonomous Intelligence
            </div>

            <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-none float-in" style={{ animationDelay: '0.2s' }}>
              <span className="block mb-4 text-shimmer">INTELLIGENCE</span>
              <span className="block bg-gradient-to-r from-[#2b59ff] via-[#7b3eff] to-[#2b59ff] bg-clip-text text-transparent">
                EVOLVED
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#cfcfcf] mb-12 max-w-3xl mx-auto leading-relaxed float-in" style={{ animationDelay: '0.4s' }}>
              Autonomous systems that learn, adapt, and grow.
            </p>

            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] font-semibold text-lg glow-breath float-in group"
              style={{ animationDelay: '0.6s' }}
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Section 2: About */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <div className="section-label text-[#cfcfcf] mb-6">Philosophy</div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  We build AI that <br />
                  <span className="bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] bg-clip-text text-transparent">
                    sees beyond data
                  </span>
                </h2>
                <p className="text-lg text-[#cfcfcf] leading-relaxed">
                  Intelligence isn't just about processing information — it's about understanding context, predicting outcomes, and evolving autonomously. We design systems that think.
                </p>
              </div>

              <div className="relative h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] opacity-20 blur-3xl neural-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-32 h-32 text-[#2b59ff]" strokeWidth={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Technology */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="section-label text-[#cfcfcf] mb-6">Core Systems</div>
              <h2 className="text-5xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] bg-clip-text text-transparent">
                  Technology Stack
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Cognitive Automation",
                  description: "Self-learning workflows that adapt to changing conditions and optimize themselves in real-time."
                },
                {
                  icon: Zap,
                  title: "Adaptive Learning",
                  description: "Neural architectures that continuously improve through pattern recognition and experience accumulation."
                },
                {
                  icon: Network,
                  title: "Autonomous Infrastructure",
                  description: "Distributed systems that scale, heal, and maintain themselves without human intervention."
                }
              ].map((tech, i) => (
                <div
                  key={i}
                  className="neural-card p-8 rounded-3xl group cursor-default"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2b59ff] to-[#7b3eff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <tech.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{tech.title}</h3>
                  <p className="text-[#cfcfcf] leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Vision */}
        <section className="py-40 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2b59ff]/5 to-transparent" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="section-label text-[#cfcfcf] mb-8">Vision</div>
            <blockquote className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#cfcfcf] via-white to-[#cfcfcf] bg-clip-text text-transparent">
                "The future <br />
                <span className="bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] bg-clip-text text-transparent">
                  thinks for itself
                </span>"
              </span>
            </blockquote>
          </div>
        </section>

        {/* Section 5: Contact */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="glass-morphism p-12 rounded-3xl glow-breath">
              <div className="text-center mb-10">
                <div className="section-label text-[#cfcfcf] mb-6">Access</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] bg-clip-text text-transparent">
                    Join the Network
                  </span>
                </h2>
                <p className="text-[#cfcfcf]">
                  Early access opens February 25, 2025
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white py-6 px-6 text-lg rounded-2xl transition-all"
                      style={{
                        borderColor: focusedInput === 'name' ? 'rgba(43, 89, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: focusedInput === 'name' ? '0 0 20px rgba(43, 89, 255, 0.2)' : 'none'
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white py-6 px-6 text-lg rounded-2xl transition-all"
                      style={{
                        borderColor: focusedInput === 'email' ? 'rgba(43, 89, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: focusedInput === 'email' ? '0 0 20px rgba(43, 89, 255, 0.2)' : 'none'
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-gradient-to-r from-[#2b59ff] to-[#7b3eff] hover:opacity-90 text-lg font-semibold rounded-2xl transition-opacity"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Request Access
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2b59ff] to-[#7b3eff] flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Neural Link Established</h3>
                  <p className="text-[#cfcfcf] text-lg">
                    You're in the network. We'll contact you at launch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <div className="text-[#cfcfcf] mb-2 section-label">
                  NeuroScale · London · EST 2026
                </div>
                <div className="text-sm text-[#cfcfcf]/60">
                  Autonomous intelligence systems
                </div>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href="https://twitter.com/neuroscale_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#2b59ff] transition-all group"
                >
                  <Twitter className="w-5 h-5 text-[#cfcfcf] group-hover:text-[#2b59ff] transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/company/neuroscale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#2b59ff] transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-[#cfcfcf] group-hover:text-[#2b59ff] transition-colors" />
                </a>
                <a
                  href="https://github.com/neuroscale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#2b59ff] transition-all group"
                >
                  <Github className="w-5 h-5 text-[#cfcfcf] group-hover:text-[#2b59ff] transition-colors" />
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-[#cfcfcf]/40">
                © 2025 NeuroScale. All rights reserved. · Powered by Base44 · Secured by neural encryption
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
