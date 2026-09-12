import { useState, useRef, useEffect } from "react";
import { Edit2, Save, X, Camera, CheckCircle2, User, Phone, Mail, Shield } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import { appToast } from "../ui/Toast";

export default function ProfileSettings() {
  const { user, updateUserUsername, updateUserProfilePhoto } = useAuth();
  const fileInputRef = useRef(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  // Edit Username Mode
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Photo Upload State
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Populate data from logged in user
  useEffect(() => {
    if (user) {
      setFullName(user.name || user.full_name || "Safiya Sharaff");
      setUsername(user.username || "safiya");
      setMobileNumber(user.mobile || user.mobile_number || "9876543210");
      setEmail(user.email || "safiya@freshai.dev");
      if (user.profilePhoto || user.profile_photo) {
        setPhotoPreview(user.profilePhoto || user.profile_photo);
      }
    }
  }, [user]);

  // Click Avatar -> trigger hidden file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle File Selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      appToast.error("Invalid photo format. Please select JPG, PNG, or WEBP.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      appToast.error("File size is too large. Maximum size is 5MB.");
      return;
    }

    // Generate Instant Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Backend immediately or prepare file
    setSelectedFile(file);
    setIsUploadingPhoto(true);

    try {
      const res = await apiService.uploadProfilePhoto(file);
      const photoUrl = res.profile_photo || res.url;
      updateUserProfilePhoto(photoUrl);
      appToast.success("Profile picture updated successfully!");
    } catch (err) {
      console.warn("Backend photo upload fallback:", err);
      // Fallback local persistence if backend is offline
      const readerData = await new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      });
      updateUserProfilePhoto(readerData);
      appToast.success("Profile picture updated successfully!");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle Username Edit Start
  const handleStartEditUsername = () => {
    setTempUsername(username);
    setUsernameError("");
    setIsEditingUsername(true);
  };

  // Cancel Username Edit
  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setUsernameError("");
  };

  // Save Username
  const handleSaveUsername = async () => {
    const trimmed = tempUsername.trim();
    if (!trimmed) {
      setUsernameError("Username cannot be empty");
      return;
    }

    if (trimmed.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsSavingUsername(true);
    setUsernameError("");

    try {
      await apiService.updateUsername(trimmed);
      setUsername(trimmed);
      updateUserUsername(trimmed);
      setIsEditingUsername(false);
      appToast.success("Username updated successfully!");
    } catch (err) {
      const errMsg = err.message || "Failed to update username";
      setUsernameError(errMsg);
      appToast.error(errMsg);
    } finally {
      setIsSavingUsername(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        {/* Interactive Avatar Container */}
        <div
          onClick={handleAvatarClick}
          className="relative group cursor-pointer shrink-0"
          title="Click to change profile picture"
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt={fullName}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-cyan-500/30 shadow-xl transition-all duration-300 group-hover:opacity-85"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 text-2xl font-black text-white ring-4 ring-cyan-500/30 shadow-xl">
              {user?.avatarInitials || (fullName ? fullName[0].toUpperCase() : "U")}
            </div>
          )}

          {/* Camera Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-950/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Camera size={24} className="text-cyan-300" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
              Upload
            </span>
          </div>

          {/* Indicator Badge */}
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-md">
            <Camera size={14} />
          </span>
        </div>

        {/* User Identity Banner */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {fullName}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Shield size={12} />
              {user?.role || "Consumer"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            @{username} · {email}
          </p>

          <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAvatarClick}
              isLoading={isUploadingPhoto}
              leftIcon={<Camera size={14} />}
            >
              {isUploadingPhoto ? "Uploading..." : "Change Profile Picture"}
            </Button>
            <span className="text-[11px] text-slate-400">
              Formats: JPG, PNG, WEBP (Max 5MB)
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Full Name Display */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <User size={16} className="text-cyan-500" />
            <span>Full Name</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {fullName}
          </p>
        </div>

        {/* Username Display & Edit Module */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <User size={16} className="text-cyan-500" />
              <span>Username</span>
            </div>

            {!isEditingUsername && (
              <button
                type="button"
                onClick={handleStartEditUsername}
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
            )}
          </div>

          {!isEditingUsername ? (
            <div className="flex items-center justify-between">
              <p className="text-base font-mono font-bold text-cyan-600 dark:text-cyan-400">
                @{username}
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="flex-1 rounded-xl border border-cyan-500/50 bg-slate-50 px-3.5 py-2 text-sm font-mono font-semibold text-slate-900 focus:border-cyan-500 focus:outline-none dark:bg-slate-800 dark:text-white"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSaveUsername}
                  isLoading={isSavingUsername}
                  leftIcon={<Save size={14} />}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancelEditUsername}
                  leftIcon={<X size={14} />}
                >
                  Cancel
                </Button>
              </div>
              {usernameError && (
                <p className="text-xs font-medium text-rose-500">
                  {usernameError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Number Display */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <Phone size={16} className="text-cyan-500" />
            <span>Mobile Number</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {mobileNumber}
          </p>
        </div>

        {/* Email Address Display */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            <Mail size={16} className="text-cyan-500" />
            <span>Email Address</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}
