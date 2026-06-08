"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password data:", formData);
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
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            <input type="submit" value="Send Reset Link" id="btn" />
          </div>
        </form>

        <div className="group">
          <Link href="/login">Remember your password? Login</Link>
        </div>
      </div>
    </section>
  );
}
