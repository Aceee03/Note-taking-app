import React, { useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useState } from "react";
import moment from "moment/moment";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import EmptyCard from "../../components/Cards/EmptyCard";
import AddNotesImg from "../../assets/images/AddNotesImage.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  // GET USER INFO
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //GET ALL NOTES
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
      if (response.data.notes.length === 0) {
        setAllNotes(null);
      }
    } catch (error) {
      console.log("An unexpected error occured while getting notes.");
    }
  };

  // DELETE NOTE
  const deleteNote = async (data) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c70000",
      cancelButtonColor: "#999999",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const noteId = data._id;
        try {
          const response = await axiosInstance.delete("/delete-note/" + noteId);
          if (response.data && response.data.note) {
            Toast.fire({
              icon: "info",
              title: "Note deleted",
            });
            getAllNotes();
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            Swal.fire("Error", error.response.data.message, "error");
          }
        }
      }
    });
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      {!userInfo ? <>Fetching Data...</> : <Navbar userInfo={userInfo} />}

      <div className="mx-auto container">
        {allNotes ? (
          <div className="grid grid-cols-3 gap-4 mt-8 ">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMM YYYY")}
                content={item.content}
                tags={item.tags.map((tag) => tag.split(" ").join("_"))}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={AddNotesImg}
            message={`Start creating notes by clicking the add button down below`}
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600
        absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-1/2 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
