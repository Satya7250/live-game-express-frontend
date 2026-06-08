"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ResetPasswordFormData {
  password: string;
}

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
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
    console.log("Reset password data:", formData);
    // TODO: Implement actual API call here - need to get token from URL params
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
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="inputBox">
            <input 
              type="password" 
              name="password" 
              placeholder="New Password" 
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <div className="inputBox">
            <input type="submit" value="Reset Password" id="btn" />
          </div>
        </form>

        <div className="group">
          <Link href="/login">Back to Login</Link>
        </div>
      </div>
    </section>
  );
}
