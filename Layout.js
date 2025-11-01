import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { LogOut, User } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, [location]);

  const checkUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const navItems = [
    { name: "Home", path: createPageUrl("Home") },
    { name: "About", path: createPageUrl("About") },
    { name: "Solutions", path: createPageUrl("Solutions") },
    { name: "Pricing", path: createPageUrl("Pricing") },
    { name: "NeuroLog", path: createPageUrl("Blog") },
    { name: "Contact", path: createPageUrl("Contact") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
 
