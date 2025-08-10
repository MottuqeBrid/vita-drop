"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";

import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

interface Hospital {
  name: string;
  address: string;
}

interface BloodRequest {
  _id: string;
  bloodGroup: string;
  quantity: number;
  hospital: Hospital;
  reasonForRequest?: string;
  status: string;
  requestedAt: string;
  fulfilledAt?: string;
}

export default function BloodRequestPage() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [editing, setEditing] = useState<BloodRequest | null>(null);
  const [editForm, setEditForm] = useState({
    bloodGroup: "",
    quantity: 1,
    hospitalName: "",
    hospitalAddress: "",
    reasonForRequest: "",
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/blood-requests");
      setRequests(res.data.data);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete Request?",
      text: "Are you sure you want to delete this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/blood-requests/${id}`);
        Swal.fire("Deleted!", "Request deleted.", "success");
        fetchRequests();
      } catch (e) {
        Swal.fire("Error", "Failed to delete request", "error");
      }
    }
  };

  const handleComplete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Mark as Fulfilled?",
      text: "This will mark the request as fulfilled.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, complete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/blood-requests/${id}/fulfill`, {
          status: "fulfilled",
          fulfilledAt: new Date(),
        });
        Swal.fire("Completed!", "Request marked as fulfilled.", "success");
        fetchRequests();
      } catch (e) {
        Swal.fire("Error", "Failed to complete request", "error");
      }
    }
  };

  const openEdit = (req: BloodRequest) => {
    setEditing(req);
    setEditForm({
      bloodGroup: req.bloodGroup,
      quantity: req.quantity,
      hospitalName: req.hospital?.name || "",
      hospitalAddress: req.hospital?.address || "",
      reasonForRequest: req.reasonForRequest || "",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await axiosSecure.put(`/blood-requests/${editing._id}`, {
        bloodGroup: editForm.bloodGroup,
        quantity: editForm.quantity,
        hospital: {
          name: editForm.hospitalName,
          address: editForm.hospitalAddress,
        },
        reasonForRequest: editForm.reasonForRequest,
      });
      Swal.fire("Updated!", "Request updated.", "success");
      setEditing(null);
      fetchRequests();
    } catch (e) {
      Swal.fire("Error", "Failed to update request", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Blood Requests</h1>
        <Link href="/dashboard/add-blood-request" className="btn btn-primary">
          Create New Request
        </Link>
      </div>
      <div className="">
        {requests.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {requests.length} of {requests.length} requests
          </p>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-400">No requests found.</div>
      ) : (
        <ul className="space-y-6">
          {requests.map((request) => (
            <li
              key={request._id}
              className="p-6 rounded-xl border bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">
                    {request.bloodGroup}
                  </span>
                  <span className="badge badge-outline ml-2 capitalize">
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {request.quantity}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Hospital:</span>{" "}
                  {request.hospital?.name} ({request.hospital?.address})
                </div>
                {request.reasonForRequest && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Reason:</span>{" "}
                    {request.reasonForRequest}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Requested: {new Date(request.requestedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2 md:flex-col md:gap-3 items-center">
                <button
                  disabled={request.status === "fulfilled"}
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => openEdit(request)}
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline btn-success"
                  onClick={() => handleComplete(request._id)}
                  disabled={request.status === "fulfilled"}
                  title="Mark as Fulfilled"
                >
                  <FiCheckCircle />
                </button>
                <button
                  disabled={request.status === "fulfilled"}
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => handleDelete(request._id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost"
              onClick={() => setEditing(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Blood Request</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={editForm.bloodGroup}
                  onChange={handleEditChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Quantity (bags)
                </label>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  value={editForm.hospitalName}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Hospital Address
                </label>
                <input
                  type="text"
                  name="hospitalAddress"
                  value={editForm.hospitalAddress}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Reason for Request
                </label>
                <textarea
                  name="reasonForRequest"
                  value={editForm.reasonForRequest}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="Optional"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Update Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
