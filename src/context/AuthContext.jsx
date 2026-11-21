import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("roavio_user");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading stored user:", e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("roavio_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("roavio_user");
      }
    } catch (e) {
      console.error("Error writing user to localStorage:", e);
    }
  }, [user]);

  /**
   * Flexible login supporting either:
   * 1. login(email, password)
   * 2. login({ email, password, role, name, ... })
   */
  const login = (emailOrObj, maybePassword) => {
    try {
      let emailStr = "";
      let userName = "";
      let userRole = "";
      let userAvatar = "RS";
      let userPhone = "+91 98765 43210";
      let userCity = "India";

      if (typeof emailOrObj === "object" && emailOrObj !== null) {
        emailStr = String(emailOrObj.email || "").trim();
        userName = emailOrObj.name || emailOrObj.fullName || "";
        userRole = emailOrObj.role || "";
        userAvatar = emailOrObj.avatar || "";
        userPhone = emailOrObj.phone || userPhone;
        userCity = emailOrObj.city || userCity;
      } else {
        emailStr = String(emailOrObj || "").trim();
      }

      if (!emailStr) {
        return { success: false, error: "Please enter a valid email address." };
      }

      const isEmailAdmin = emailStr.toLowerCase().includes("admin") || emailStr.toLowerCase() === "admin@roavio.com";

      if (!userRole) {
        userRole = isEmailAdmin ? "Administrator" : "Traveler";
      }

      if (!userName) {
        if (isEmailAdmin) {
          userName = "Roavio Administrator";
        } else {
          const parts = emailStr.split("@")[0].replace(/[._-]/g, " ").trim();
          userName = parts ? parts.replace(/\b\w/g, (c) => c.toUpperCase()) : "Traveler";
        }
      }

      if (!userAvatar) {
        userAvatar = userName.substring(0, 2).toUpperCase() || "RS";
      }

      const loggedInUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: userName,
        email: emailStr,
        phone: userPhone,
        city: userCity,
        role: userRole,
        avatar: userAvatar,
        isLoggedIn: true
      };

      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error("Login exception:", err);
      return { success: false, error: err.message || "Failed to log in" };
    }
  };

  /**
   * Registration supporting new accounts
   */
  const register = (userData) => {
    try {
      if (!userData || !userData.email) {
        return { success: false, error: "Email address is required." };
      }

      const fullName = (userData.fullName || userData.name || "Traveler").trim();
      const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "TR";

      const newUser = {
        id: userData.id || `usr-${Date.now().toString().slice(-4)}`,
        name: fullName,
        email: String(userData.email).trim(),
        phone: userData.phone || "+91 98765 43210",
        city: userData.city || "New Delhi",
        role: userData.role || (userData.email.toLowerCase().includes("admin") ? "Administrator" : "Traveler"),
        avatar: initials,
        isLoggedIn: true
      };

      // Also persist to registered users list
      try {
        const storedList = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
        const filtered = storedList.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase());
        filtered.push({ ...newUser, registeredAt: new Date().toISOString() });
        localStorage.setItem("roavio_registered_users", JSON.stringify(filtered));
      } catch (e) {
        console.warn("Could not save to registered users list:", e);
      }

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      console.error("Register exception:", err);
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAdmin: user?.role === "Administrator" 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
