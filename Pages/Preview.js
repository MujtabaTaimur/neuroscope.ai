import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Lock, Check, Download, Code, FileText, ArrowLeft, Shield, CreditCard, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Preview() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState("free");

  useEffect(() => {
    loadWebsite();
  }, []);

  const loadWebsite = async () => {
    try {
      // Check authentication
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        toast.error("🔒 Please log in to continue");
        base44.auth.redirectToLogin(window.location.pathname + window.location.search);
        return;
      }

      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      
      if (!id) {
        navigate(createPageUrl("Builder"));
        return;
      }

      const websites = await base44.entities.GeneratedWebsite.filter({ id });
      
      if (websites.length === 0) {
        toast.error("Website not found");
        navigate(createPageUrl("Builder"));
        return;
      }

      const foundWebsite = websites[0];

      // Security check - verify ownership
      if (foundWebsite.user_email !== currentUser.email && currentUser.role !== "admin") {
        toast.error("🔒 Unauthorized access");
        navigate(createPageUrl("Builder"));
        return;
      }

      setWebsite(foundWebsite);

      // Check subscription status
      const subscriptions = await base44.entities.Subscription.filter({
        user_email: currentUser.email,
        status: "active"
      });

      if (subscriptions.length > 0) {
        const sub = subscriptions[0];
        // Check expiration for monthly
        if (sub.tier === "monthly" && sub.expires_at) {
          const expireDate = new Date(sub.expires_at);
          if (expireDate < new Date()) {
            await base44.entities.Subscription.update(sub.id, { status: "expired" });
            setUserTier("free");
          } else {
            setUserTier(sub.tier);
          }
        } else {
          setUserTier(sub.tier);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load website");
    }
    setLoading(false);
  };

  const handleUnlock = async (tier) => {
    setUnlocking(true);
    try {
      // In production, this would integrate with Stripe or your payment processor
      // For now, we'll simulate the unlock
      
      const expiresAt = tier === "monthly" 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
        : null;

      // Create subscription record
      await base44.entities.Subscription.create({
        user_email: user.email,
        tier: tier,
        amount_paid: tier === "one_time" ? 29 : 9,
        status: "active",
        expires_at: expiresAt
      });

      // Update website to unlocked
      await base44.entities.GeneratedWebsite.update(website.id, {
        is_unlocked: true
      });

      toast.success("🎉 Full access unlocked! You can now download all content.");
      await loadWebsite();
    } catch (error) {
      console.error(error);
      toast.error("Payment processing failed. Please try again.");
    }
    setUnlocking(false);
  };

  const downloadHTML = () => {
    if (!website?.premium_content?.full_html) {
      toast.error("HTML content not available");
      return;
    }
    
    const blob = new Blob([website.premium_content.full_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.brand_name.toLowerCase().replace(/\s+/g, '-')}-website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("HTML downloaded successfully!");
  };

  const downloadJSON = () => {
    if (!website?.premium_content) {
      toast.error("Premium content not available");
      return;
    }
    
    const blob = new Blob([JSON.stringify(website.premium_content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.brand_name.toLowerCase().replace(/\s+/g, '-')}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded successfully!");
  };

  const downloadSEO = () => {
    if (!website?.premium_content) {
      toast.error("Premium content not available");
      return;
    }

    const seoContent = `SEO Metadata - ${website.brand_name}
    
Title: ${website.premium_content.title}
Meta Description: ${website.premium_content.meta_description}

Hero Section:
${website.premium_content.hero_section?.headline || ''}
${website.premium_content.hero_section?.subheadline || ''}

Generated by NeuroScopes AI
Date: ${new Date().toISOString().split('T')[0]}
`;
    
    const blob = new Blob([seoContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.brand_name.toLowerCase().replace(/\s+/g, '-')}-seo.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SEO file downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050810] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
 
