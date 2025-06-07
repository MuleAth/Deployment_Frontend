// InventorySection.jsx
import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

function InventorySection() {
  // Inventory state fetched from the backend
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState(null);

  // New state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Editing state for modifying available quantity
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Modal visibility and form state for adding equipment
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    item: "",
    available: "",
    total: "",
  });

  // Function to fetch inventory from backend GET endpoint.
  // (Ensure your backend route exists at "/api/admin/equipment")
  const fetchInventory = async () => {
    try {
      setLoadingInventory(true);
      const response = await fetch("http://localhost:5000/api/admin/equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const result = await response.json();
      // If the response is wrapped in an object (like { data: [...] }), adjust accordingly.
      const equipments = Array.isArray(result) ? result : result.data;
      if (!Array.isArray(equipments)) {
        throw new Error("Unexpected response format");
      }
      // Map backend keys to the UI keys
      const mappedInventory = equipments.map((equip) => ({
        item: equip.equipmentname,
        available: equip.availableQuantity,
        total: equip.TotalQuantity,
      }));
      setInventory(mappedInventory);
      setInventoryError(null);
    } catch (error) {
      setInventoryError(error.message);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter inventory based on the search query (case-insensitive)
  const filteredInventory = inventory.filter((invItem) =>
    invItem.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle editing an inventory item
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditValue(item.available.toString());
  };

  // Save updated available quantity (updates only local state in this example)
  const handleSave = () => {
    const newValue = parseInt(editValue);
    if (
      !isNaN(newValue) &&
      newValue >= 0 &&
      newValue <= editingItem.total
    ) {
      setInventory(
        inventory.map((invItem) =>
          invItem.item === editingItem.item
            ? { ...invItem, available: newValue }
            : invItem
        )
      );
    }
    setEditingItem(null);
  };

  // Handle form submission to add new equipment via the backend API
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    if (
      newEquipment.item &&
      newEquipment.available !== "" &&
      newEquipment.total !== "" &&
      parseInt(newEquipment.available) >= 0 &&
      parseInt(newEquipment.total) >= 0
    ) {
      try {
        const payload = {
          equipmentname: newEquipment.item,
          availableQuantity: parseInt(newEquipment.available),
          TotalQuantity: parseInt(newEquipment.total),
        };

        const response = await fetch(
          "http://localhost:5000/api/admin/equipment/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add equipment");
        }
        await response.json();
        // Refresh the inventory list after successful addition
        await fetchInventory();
        setNewEquipment({ item: "", available: "", total: "" });
        setShowAddForm(false);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Inventory
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> Add Equipment
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {loadingInventory ? (
        <p>Loading inventory...</p>
      ) : inventoryError ? (
        <p className="text-red-500">{inventoryError}</p>
      ) : (
        // Container limited to about 6 items (max-height set to 480px) with vertical scroll
        <div className="space-y-4 overflow-y-auto max-h-[480px]">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <div
                key={item.item}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-800 dark:text-gray-300">
                  {item.item}
                </span>
                {editingItem?.item === item.item ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 px-2 py-1 rounded border dark:bg-gray-600 dark:border-gray-500"
                      min="0"
                      max={item.total}
                    />
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {item.available} / {item.total}
                    </span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No matching equipment found</p>
          )}
        </div>
      )}

      {/* Modal Overlay for Adding Equipment */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred and darkened background overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          ></div>
          {/* Modal form container */}
          <form
            onSubmit={handleAddEquipment}
            className="relative z-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg w-11/12 max-w-md"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Add New Equipment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={newEquipment.item}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, item: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Quantity
                </label>
                <input
                  type="number"
                  value={newEquipment.total}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, total: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Quantity
                </label>
                <input
                  type="number"
                  value={newEquipment.available}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, available: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  max={newEquipment.total || ""}
                  required
                />
              </div>
              <div className="flex space-x-2 justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add to Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default InventorySection;
