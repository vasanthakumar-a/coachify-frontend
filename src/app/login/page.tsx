"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Login() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password:
        step === 2
          ? Yup.string().min(6, "Minimum 6 characters").required("Required")
          : null,
    }),
    onSubmit: async (values) => {
      if (step === 1) {
        // Email verification step
        setStep(2);
      } else {
        // Login with NextAuth
        setError(""); // Clear previous errors
        try {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false, // We'll handle redirect manually
          });

          if (result?.error) {
            setError(result.error);
          } else {
            // Login successful - redirect to home or previous page
            router.push("/");
            router.refresh(); // Refresh server components
          }
        } catch (err) {
          setError("Login failed. Please try again.");
          console.error("Login error:", err);
        }
      }
    },
  });

  // Use useEffect for redirect when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Handle social logins
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Google login failed");
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch (error) {
      setError("Facebook login failed");
      console.error("Facebook login error:", error);
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {step === 1 ? "Enter Email" : "Enter Password"}
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6" onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps("password")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            {step === 2 && (
              <>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : step === 1 ? (
              "Next"
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or sign in with</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={formik.isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.3 0 6 .8 8.4 2.3l6.3-6.3C33.8 2.1 29.3.5 24 .5 14.6.5 6.6 5.5 2.3 12.9l7.5 5.8c2.4-7.1 9.2-12.2 16.2-12.2z"
                />
                <path
                  fill="#4285F4"
                  d="M46.1 24.5c0-1.4-.1-2.7-.3-4H24v8.3h12.7c-.6 3.1-2.3 5.6-4.8 7.3l7.5 5.8c4.6-4.2 7.3-10.3 7.3-17.4z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.5 28.7C9.6 26.5 9 24.1 9 21.5s.6-5 1.5-7.2L2.3 8.5C.9 11.2 0 14.2 0 17.5c0 5.6 1.9 10.8 5.1 14.9l7.4-5.7z"
                />
                <path
                  fill="#34A853"
                  d="M24 47.5c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.2 1.5-4.9 2.4-8 2.4-7.1 0-13.1-4.8-15.3-11.2l-7.5 5.8c3.8 7.7 11.8 12.9 20.4 12.9z"
                />
              </svg>
              Google
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={formik.isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}