import { useState, useEffect } from "react";
import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from "../api/animalApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiX } from "react-icons/hi";

const categories = ["mammal", "bird", "reptile", "amphibian", "insect", "fish", "other"];
const statuses = ["least_concern", "near_threatened", "vulnerable", "endangered", "critically_endangered", "extinct_in_wild"];

const emptyForm = { species_name: "", category: "mammal", conservation_status: "least_concern", info_description: "", image_url: "", habitat: "", region_found: "" };

export default function AdminAnimalManagement() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchAnimals = async () => {
    try { const res = await getAnimals(); setAnimals(res.data); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAnimals(); }, []);

  const openAdd = () => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); };
  const openEdit = (a) => { setForm({ species_name: a.species_name, category: a.category, conservation_status: a.conservation_status, info_description: a.info_description || "", image_url: a.image_url || "", habitat: a.habitat || "", region_found: a.region_found || "" }); setEditingId(a._id); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.species_name || !form.category) { toast.error("Name and category required"); return; }
    setSaving(true);
    try {
      if (editingId) { await updateAnimal(editingId, form); toast.success("Updated!"); }
      else { await createAnimal(form); toast.success("Added!"); }
      setShowModal(false);
      fetchAnimals();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this species?")) return;
    try { await deleteAnimal(id); toast.success("Deleted"); fetchAnimals(); }
    catch { toast.error("Delete failed"); }
  };

  if (loading) return <LoadingSpinner text="Loading animals..." />;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Animal Management</h1>
        <button onClick={openAdd} className="btn-primary py-2 px-4 sm:px-5 rounded-xl text-xs sm:text-sm self-start sm:self-auto"><HiPlus /> Add Species</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-warm-200">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-forest-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Species</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Habitat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {animals.map((a) => (
                <tr key={a._id} className="hover:bg-warm-bg transition">
                  <td className="px-4 py-3 flex items-center gap-2">
                    {a.image_url && <img src={a.image_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                    <span className="font-medium text-sm truncate max-w-[120px]">{a.species_name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-text-secondary">{a.category}</td>
                  <td className="px-4 py-3 text-sm capitalize text-text-secondary">{a.conservation_status?.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary max-w-[200px] truncate">{a.habitat || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><HiPencil className="text-sm sm:text-base" /></button>
                      <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><HiTrash className="text-sm sm:text-base" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {animals.length === 0 && <p className="text-center text-text-muted py-8 text-sm sm:text-base">No animals found</p>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">{editingId ? "Edit Species" : "Add New Species"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-warm-100 rounded-lg flex-shrink-0"><HiX className="text-lg sm:text-xl" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1">Species Name *</label>
                <input value={form.species_name} onChange={(e) => setForm({ ...form, species_name: e.target.value })} className="input-field text-sm sm:text-base" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm sm:text-base">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1">Conservation Status</label>
                  <select value={form.conservation_status} onChange={(e) => setForm({ ...form, conservation_status: e.target.value })} className="input-field text-sm sm:text-base">
                    {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1">Description</label>
                <textarea value={form.info_description} onChange={(e) => setForm({ ...form, info_description: e.target.value })} className="input-field min-h-[60px] sm:min-h-[80px] text-sm sm:text-base" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field text-sm sm:text-base" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1">Habitat</label>
                  <input value={form.habitat} onChange={(e) => setForm({ ...form, habitat: e.target.value })} className="input-field text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1">Region</label>
                  <input value={form.region_found} onChange={(e) => setForm({ ...form, region_found: e.target.value })} className="input-field text-sm sm:text-base" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-2.5 rounded-xl text-sm sm:text-base">
                {saving ? "Saving..." : editingId ? "Update Species" : "Add Species"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
