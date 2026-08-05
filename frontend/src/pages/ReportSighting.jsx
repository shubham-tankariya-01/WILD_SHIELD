import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createReport } from "../api/reportApi";
import { getAnimals } from "../api/animalApi";
import toast from "react-hot-toast";
import { HiCamera, HiLocationMarker, HiUpload } from "react-icons/hi";

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function ReportSighting() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [position, setPosition] = useState(null);
  const [form, setForm] = useState({
    animal_type: "",
    description: "",
    address: "",
    priority: "medium",
  });

  useEffect(() => {
    getAnimals().then((res) => setAnimals(res.data)).catch(() => {});
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([23.0225, 72.5714]) // Default: Ahmedabad
      );
    } else {
      setPosition([23.0225, 72.5714]);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.animal_type || !form.description || !position) {
      toast.error("Please fill in animal type, description, and pick a location on the map");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("animal_type", form.animal_type);
      formData.append("description", form.description);
      formData.append("lat", position[0]);
      formData.append("lng", position[1]);
      formData.append("address", form.address);
      formData.append("priority", form.priority);
      if (photoFile) formData.append("photo", photoFile);

      await createReport(formData);
      toast.success("Report submitted successfully!");
      navigate("/my-reports");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Report a Wildlife Sighting</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">
          Help us protect wildlife by reporting injured, distressed, or unusual sightings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Form Fields */}
          <div className="space-y-4 sm:space-y-5">
            <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h2 className="font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
                🐾 Animal Details
              </h2>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Animal Type *</label>
                <select
                  value={form.animal_type}
                  onChange={(e) => setForm({ ...form, animal_type: e.target.value })}
                  className="input-field text-sm sm:text-base"
                >
                  <option value="">Select species...</option>
                  {animals.map((a) => (
                    <option key={a._id} value={a.species_name}>{a.species_name}</option>
                  ))}
                  <option value="Unknown">Unknown / Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px] sm:min-h-[120px] resize-y text-sm sm:text-base"
                  placeholder="Describe the situation, condition of the animal, any visible injuries..."
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Priority</label>
                <div className="flex gap-2 flex-wrap">
                  {["low", "medium", "high", "critical"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize transition flex-1 sm:flex-none text-center ${
                        form.priority === p
                          ? p === "low" ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                          : p === "medium" ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400"
                          : p === "high" ? "bg-orange-100 text-orange-700 ring-2 ring-orange-400"
                          : "bg-red-100 text-red-700 ring-2 ring-red-400"
                          : "bg-warm-100 text-text-secondary hover:bg-warm-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-base sm:text-lg text-text-primary flex items-center gap-2 mb-3 sm:mb-4">
                <HiCamera className="text-forest" /> Photo
              </h2>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-warm-200 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-forest-light transition group">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="max-h-40 sm:max-h-48 rounded-lg object-cover" />
                ) : (
                  <>
                    <HiUpload className="text-2xl sm:text-3xl text-text-muted group-hover:text-forest mb-2" />
                    <p className="text-xs sm:text-sm text-text-muted text-center">Click to upload photo</p>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-1 text-center">JPG, PNG, GIF up to 5MB</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right: Map */}
          <div className="space-y-4 sm:space-y-5">
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-base sm:text-lg text-text-primary flex items-center gap-2 mb-3 sm:mb-4">
                <HiLocationMarker className="text-forest" /> Location *
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mb-3">
                Click on the map to set the sighting location
              </p>
              <div className="rounded-xl overflow-hidden border border-warm-200" style={{ height: "250px" }}>
                {position && (
                  <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker position={position} setPosition={setPosition} />
                  </MapContainer>
                )}
              </div>
              {position && (
                <p className="text-[10px] sm:text-xs text-text-muted mt-2 truncate">
                  📍 {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </p>
              )}
              <div className="mt-3">
                <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Address / Landmark</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input-field text-sm sm:text-base"
                  placeholder="e.g., Near SG Highway, Ahmedabad"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 sm:px-0">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto justify-center py-2.5 sm:py-3 px-8 sm:px-12 rounded-xl text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
