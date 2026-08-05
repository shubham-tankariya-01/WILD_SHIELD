import { useState, useEffect } from "react";
import { getAnimals } from "../api/animalApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { HiSearch, HiFilter, HiX } from "react-icons/hi";

const categoryLabels = { mammal: "🐾 Mammal", bird: "🦅 Bird", reptile: "🦎 Reptile", amphibian: "🐸 Amphibian", insect: "🦋 Insect", fish: "🐟 Fish", other: "❓ Other" };
const statusLabels = { least_concern: "Least Concern", near_threatened: "Near Threatened", vulnerable: "Vulnerable", endangered: "Endangered", critically_endangered: "Critically Endangered", extinct_in_wild: "Extinct in Wild" };
const statusColors = { least_concern: "bg-green-50 text-green-700", near_threatened: "bg-yellow-50 text-yellow-700", vulnerable: "bg-amber-50 text-amber-700", endangered: "bg-orange-50 text-orange-700", critically_endangered: "bg-red-50 text-red-700", extinct_in_wild: "bg-gray-100 text-gray-700" };

export default function WildlifeInfo() {
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    getAnimals().then((res) => { setAnimals(res.data); setFiltered(res.data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = animals;
    if (search) result = result.filter((a) => a.species_name.toLowerCase().includes(search.toLowerCase()) || a.info_description?.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) result = result.filter((a) => a.category === categoryFilter);
    if (statusFilter) result = result.filter((a) => a.conservation_status === statusFilter);
    setFiltered(result);
  }, [search, categoryFilter, statusFilter, animals]);

  if (loading) return <LoadingSpinner text="Loading wildlife database..." />;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Wildlife Information</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Explore {animals.length} documented species in our database</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 sm:pl-10 text-sm sm:text-base" placeholder="Search species..." />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field sm:w-48 text-sm sm:text-base">
          <option value="">All Categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-56 text-sm sm:text-base">
          <option value="">All Conservation Status</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12"><HiFilter className="text-3xl sm:text-4xl text-text-muted mx-auto mb-3" /><p className="text-sm sm:text-base text-text-secondary">No species found matching your filters</p></div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((animal) => (
            <div key={animal._id} onClick={() => setSelectedAnimal(animal)} className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover cursor-pointer group flex flex-col">
              <div className="h-40 sm:h-44 overflow-hidden bg-warm-100 flex-shrink-0">
                {animal.image_url ? (
                  <img src={animal.image_url} alt={animal.species_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">{categoryLabels[animal.category]?.charAt(0) || "🐾"}</div>
                )}
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-text-primary mb-1 truncate text-base sm:text-lg">{animal.species_name}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs bg-forest-50 text-forest px-1.5 sm:px-2 py-0.5 rounded-full capitalize truncate">{animal.category}</span>
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full truncate ${statusColors[animal.conservation_status] || ""}`}>
                    {statusLabels[animal.conservation_status] || animal.conservation_status}
                  </span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm line-clamp-2 mt-auto">{animal.info_description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={() => setSelectedAnimal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {selectedAnimal.image_url && <img src={selectedAnimal.image_url} alt="" className="w-full h-40 sm:h-56 object-cover" />}
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary pr-2">{selectedAnimal.species_name}</h2>
                <button onClick={() => setSelectedAnimal(null)} className="p-1 hover:bg-warm-100 rounded-lg flex-shrink-0"><HiX className="text-lg sm:text-xl" /></button>
              </div>
              <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                <span className="text-xs sm:text-sm bg-forest-50 text-forest px-2 sm:px-3 py-1 rounded-full capitalize">{selectedAnimal.category}</span>
                <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${statusColors[selectedAnimal.conservation_status] || ""}`}>
                  {statusLabels[selectedAnimal.conservation_status]}
                </span>
              </div>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">{selectedAnimal.info_description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                {selectedAnimal.habitat && <div className="bg-warm-bg p-2.5 sm:p-3 rounded-xl"><p className="text-[10px] sm:text-xs text-text-muted mb-0.5 sm:mb-1">Habitat</p><p className="font-medium">{selectedAnimal.habitat}</p></div>}
                {selectedAnimal.region_found && <div className="bg-warm-bg p-2.5 sm:p-3 rounded-xl"><p className="text-[10px] sm:text-xs text-text-muted mb-0.5 sm:mb-1">Region</p><p className="font-medium">{selectedAnimal.region_found}</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
