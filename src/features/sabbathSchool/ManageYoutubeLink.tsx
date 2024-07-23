import { useState, useEffect } from "react";
import {
  useAddVideoLinkMutation,
  useUpdateVideoLinkMutation,
  useDeleteVideoLinkMutation,
  useGetVideoLinkQuery,
} from "../../services/videoLinksApi";
import Modal from "react-modal";
import { YoutubeLogo } from "@phosphor-icons/react";

type ManageYouTubeLinkProps = {
  year: number;
  quarter: number;
  lesson: number;
};

const ManageYouTubeLink = ({
  year,
  quarter,
  lesson,
}: ManageYouTubeLinkProps) => {
  const {
    data: videoLink,
    error,
    isLoading,
    refetch,
  } = useGetVideoLinkQuery({ year, quarter, lesson });

  const [videoUrl, setVideoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addVideoLink] = useAddVideoLinkMutation();
  const [updateVideoLink] = useUpdateVideoLinkMutation();
  const [deleteVideoLink] = useDeleteVideoLinkMutation();

  useEffect(() => {
    if (videoLink) {
      setVideoUrl(videoLink.videoUrl);
    } else {
      setVideoUrl("");
    }
  }, [videoLink]);

  useEffect(() => {
    if (!isModalOpen) {
      refetch();
    }
  }, [isModalOpen, refetch]);

  const handleAddOrUpdate = async () => {
    try {
      if (videoLink) {
        await updateVideoLink({ year, quarter, lesson, videoUrl });
      } else {
        await addVideoLink({ year, quarter, lesson, videoUrl });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add or update video link:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideoLink({ year, quarter, lesson });
      refetch();
    } catch (error) {
      console.error("Failed to delete video link:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error.status === 404) {
      console.warn(
        "Video link not found for the specified year, quarter, and lesson."
      );
    } else {
      console.error("Error fetching video link:", error);
      return <div>Error: {error.message}</div>;
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">YouTube Link</h3>
      <div className="flex justify-end mt-2 md:mt-4 space-x-2">
        {videoLink ? (
          <>
            <a
              href={videoLink.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
            >
              Watch on YouTube <YoutubeLogo size={24} weight="fill" />
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
            >
              Edit Link
            </button>
            <button
              onClick={handleDelete}
              className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
            >
              Delete Link
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
          >
            Add YouTube Link
          </button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add or Update YouTube Link"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">
            {videoLink ? "Update" : "Add"} YouTube Link
          </h2>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube Link"
            className="w-full p-2 mb-4 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddOrUpdate}
              className="bg-accent-5 text-white px-4 py-2 rounded hover:bg-accent-8"
            >
              {videoLink ? "Update" : "Add"} Link
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageYouTubeLink;
