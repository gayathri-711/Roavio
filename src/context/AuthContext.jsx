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
        recordUserInStore(user);
      } else {
        localStorage.removeItem("roavio_user");
      }
    } catch (e) {
      console.error("Error writing user to localStorage:", e);
    }
  }, [user]);

  /**
   * Helper to ensure every registered or logged-in user is stored in
   * the persistent platform user directory and synced with the Admin backend.
   */
  const recordUserInStore = (userObj) => {
    if (!userObj || !userObj.email) return;
    try {
      const email = String(userObj.email).trim().toLowerCase();
      const storedList = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
      const existingIdx = storedList.findIndex(u => u.email && u.email.toLowerCase() === email);

      const record = {
        id: userObj.id || `usr-${Date.now().toString().slice(-4)}`,
        name: userObj.name || userObj.fullName || "Traveler",
        fullName: userObj.fullName || userObj.name || "Traveler",
        email: email,
        phone: userObj.phone || userObj.mobileNumber || "+91 98765 43210",
        mobileNumber: userObj.mobileNumber || userObj.phone || "9876543210",
        city: userObj.city || "New Delhi",
        role: userObj.role || (email.includes("admin") ? "Administrator" : "Traveler"),
        avatar: userObj.avatar || (userObj.name || "TR").substring(0, 2).toUpperCase(),
        status: userObj.status || "Active",
        kycStatus: "Verified",
        bookingsCount: existingIdx >= 0 ? (storedList[existingIdx].bookingsCount || 0) : 0,
        tripsPlanned: existingIdx >= 0 ? (storedList[existingIdx].tripsPlanned || 0) : 0,
        registeredAt: existingIdx >= 0 ? (storedList[existingIdx].registeredAt || new Date().toISOString()) : new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        storedList[existingIdx] = { ...storedList[existingIdx], ...record };
      } else {
        storedList.unshift(record);
      }
      localStorage.setItem("roavio_registered_users", JSON.stringify(storedList));

      // Asynchronously sync with backend admin database
      fetch("/api/admin/record-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      }).catch(err => console.warn("Admin user record sync:", err.message));
    } catch (e) {
      console.warn("Could not save to registered users list:", e);
    }
  };

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

      recordUserInStore(loggedInUser);
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

      recordUserInStore(newUser);
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
