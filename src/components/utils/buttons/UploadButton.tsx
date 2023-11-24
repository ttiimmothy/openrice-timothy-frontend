const UploadButton: React.FC<{
  showUploadImageModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showUploadImageModal }) => {
  return (
    <button
      type="submit"
      className="border-gray-700 h-full w-20 flex justify-center items-center rounded-md text-md px-11 py-2 border-1 hover:bg-gray-700 hover:text-white"
      onClick={() => showUploadImageModal(true)}
    >
      upload
    </button>
  );
};

export default UploadButton;
