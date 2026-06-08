"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: "player" | "developer";
  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    role: "player",
    phone: "",
    avatar: "",
    address: "",
    bio: "",
  });

  const leaves = [
    "/leaf_01.png",
    "/leaf_02.png",
    "/leaf_03.png",
    "/leaf_04.png",
    "/leaf_01.png",
    "/leaf_02.png",
    "/leaf_03.png",
    "/leaf_04.png",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup data:", formData);
    // TODO: Implement actual API call here
  };

  return (
    <section className="hero">
      <Image
        src="/bg.jpg"
        alt="background"
        fill
        priority
        className="bg"
      />

      <div className="leaves">
        <div className="set">
          {leaves.map((leaf, index) => (
            <div key={index}>
              <Image
                src={leaf}
                alt="leaf"
                width={80}
                height={80}
                priority
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Image
        src="/girl.png"
        alt="girl"
        width={500}
        height={500}
        priority
        className="girl"
      />

      <Image
        src="/trees.png"
        alt="trees"
        fill
        priority
        className="trees"
      />

      <div className="login">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left Column - 4 fields */}
            <div className="inputBox">
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                required
              />
            </div>

            <div className="inputBox">
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputBox">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="player">Player</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            <div className="inputBox">
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number (optional)" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Right Column - 4 fields */}
            <div className="inputBox">
              <input 
                type="text" 
                name="avatar" 
                placeholder="Avatar URL (optional)" 
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            <div className="inputBox">
              <input 
                type="text" 
                name="address" 
                placeholder="Address (optional)" 
                value={formData.address}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="inputBox">
              <textarea
                name="bio"
                placeholder="Bio (optional)"
                value={formData.bio}
                onChange={handleChange}
                maxLength={100}
                rows={2}
              />
            </div>

            <div className="inputBox">
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
          </div>

          {/* Submit Button - Full Width */}
          <div className="inputBox mt-3">
            <input type="submit" value="Signup" id="btn" />
          </div>
        </form>

        <div className="group">
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </div>
    </section>
  );
}
