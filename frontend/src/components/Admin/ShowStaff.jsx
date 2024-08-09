import React, { useState } from 'react'
import {
  useAllStaff,
  useAddStaff,
  useDeleteStaff,
  useUpdateStaff,
} from '../../hooks/useStaff'
import Loader from '../shared/Loader'
const ShowStaff = () => {
  const { data: staff, isLoading, isError, error } = useAllStaff()
  const addStaffMutation = useAddStaff()
  const deleteStaffMutation = useDeleteStaff()
  const updateStaffMutation = useUpdateStaff()

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    phoneNumber: '',
    shift: '',
    dateOfJoining: '',
  })

  const [editStaff, setEditStaff] = useState(null)

  const handleAddStaff = () => {
    addStaffMutation.mutate(newStaff, {
      onSuccess: () =>
        setNewStaff({
          name: '',
          role: '',
          phoneNumber: '',
          shift: '',
          dateOfJoining: '',
        }),
    })
  }

  const handleEditStaff = (staff) => {
    setEditStaff(staff)
  }
  const handleDeleteStaff = (staffId) => {
    deleteStaffMutation.mutate(staffId)
  }

  const handleUpdateStaff = (updatedStaff) => {
    updateStaffMutation.mutate(
      { staffId: updatedStaff._id, updatedData: updatedStaff },
      {
        onSuccess: () => setEditStaff(null),
      }
    )
  }

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    )
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div className="container  text-base px-4 py-6">
      <h2 className="text-2xl  font-bold mb-4">Staff Members</h2>
      <div className="  justify-evenly">
        <div className="mb-4 max-w-sm">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl my-3 px-1 font-semibold">
              Add New Staff Member
            </h3>
            <input
              type="text"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="border px-2 py-1 rounded-xl"
            />
            <input
              type="text"
              placeholder="Role"
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
              className="border px-2 py-1 rounded-xl"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newStaff.phoneNumber}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  phoneNumber: parseInt(e.target.value),
                })
              }
              className="border px-2 py-1 rounded-xl"
            />
            <input
              type="text"
              placeholder="Shift"
              value={newStaff.shift}
              onChange={(e) =>
                setNewStaff({ ...newStaff, shift: e.target.value })
              }
              className="border px-2 py-1 rounded-xl"
            />
            <input
              type="date"
              placeholder="Date of Joining"
              value={newStaff.dateOfJoining}
              onChange={(e) =>
                setNewStaff({ ...newStaff, dateOfJoining: e.target.value })
              }
              className="border px-2 py-1 rounded-xl"
            />
            <button
              onClick={handleAddStaff}
              className="bg-blue-500 w-fit border px-2 py-1 rounded-xl text-white"
            >
              Add Staff
            </button>
          </div>
        </div>

        <div className="max-w-sm  h-fit p-2 rounded-lg text-base bg-white">
          <h3 className="text-xl font-semibold mb-2">All Staff Members</h3>

          {staff?.data?.map((staffMember) => (
            <div key={staffMember._id} className=" p-4 rounded">
              {editStaff && editStaff._id === staffMember._id ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editStaff.name}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, name: e.target.value })
                    }
                    className="border px-2 py-1 rounded-xl"
                  />
                  <input
                    type="text"
                    value={editStaff.role}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, role: e.target.value })
                    }
                    className="border px-2 py-1 rounded-xl"
                  />
                  <input
                    type="text"
                    value={editStaff.phoneNumber}
                    onChange={(e) =>
                      setEditStaff({
                        ...editStaff,
                        phoneNumber: parseInt(e.target.value),
                      })
                    }
                    className="border px-2 py-1 rounded-xl"
                  />
                  <input
                    type="text"
                    value={editStaff.shift}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, shift: e.target.value })
                    }
                    className="border px-2 py-1 rounded-xl"
                  />
                  <input
                    type="date"
                    value={editStaff.dateOfJoining}
                    onChange={(e) =>
                      setEditStaff({
                        ...editStaff,
                        dateOfJoining: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded-xl"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleUpdateStaff(editStaff)}
                      className="bg-green-500 w-fit text-white px-2 py-1 rounded-xl "
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditStaff(null)}
                      className="bg-red-500  w-fit text-white text-base  border px-2 py-1 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100  rounded-lg p-2">
                  <p>Name: {staffMember.name}</p>
                  <p>Role: {staffMember.role}</p>
                  <p>Phone Number: {staffMember.phoneNumber}</p>
                  <p>Shift: {staffMember.shift}</p>
                  <p>Date of Joining: {staffMember.dateOfJoining}</p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditStaff(staffMember)}
                      className="bg-yellow-500 text-white  text-sm border px-2 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staffMember._id)}
                      className="bg-red-500 text-white  text-sm border px-2 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowStaff
