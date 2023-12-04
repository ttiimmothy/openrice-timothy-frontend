/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { closeSnackbar, enqueueSnackbar } from "notistack";

import { AppDispatch, IRootState } from "../../../store";
import { createReviewThunk } from "../../../redux/review/reviewSlice";
import { createReview } from "../../../api/review/reviewApiIndex";
import { uploadImage } from "../../../utils/uploadImageService";
import { fileTypeToExtension } from "../../../utils/fileTypeToExtension";
import TextInput from "../inputs/TextInput";
import TextareaInput from "../inputs/TextareaInput";
import NumberInput from "../inputs/NumberInput";
import FileInput from "../inputs/FileInput";
import DateInput from "../inputs/DateInput";

interface CreateReviewModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  formRef: React.MutableRefObject<HTMLDivElement | null>;
  restaurant_id?: string;
}

export interface ReviewForm {
  rating: number;
  title: string;
  visit_date: string;
  content: string;
  spending: number;
  photo?: any;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = (props) => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<ReviewForm>({
    defaultValues: {
      title: "",
      content: "",
      spending: 0,
      rating: 0,
      visit_date: "",
      photo: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: IRootState) => state.auth.currentUser);

  const createNewReview = useCallback(
    async (review: ReviewForm) => {
      if (user?.user_id) {
        if (review.photo) {
          const res = await createReview(
            {
              title: review.title,
              content: review.content,
              spending: review.spending,
              rating: review.rating,
              restaurant_id: props?.restaurant_id as string,
              user_id: user?.user_id,
              visit_date: new Date(review.visit_date),
            },
            props.restaurant_id as string,
            "Review",
            fileTypeToExtension[review.photo?.type]
          );

          await uploadImage(
            review.photo,
            props.restaurant_id as string,
            "photos",
            res?.review_id,
            fileTypeToExtension[review.photo.type]
          );

          enqueueSnackbar("Review and Review photo are added successfully", {
            variant: "success",
          });
        } else {
          dispatch(
            createReviewThunk({
              review: {
                title: review.title,
                content: review.content,
                spending: review.spending,
                rating: review.rating,
                restaurant_id: props?.restaurant_id as string,
                user_id: user?.user_id,
                visit_date: new Date(review.visit_date),
              },
              restaurantID: props.restaurant_id as string,
              photoCategory: "Review",
            })
          );

          enqueueSnackbar("Review is added successfully", {
            variant: "success",
          });
        }

        props.setShow(false);
        setTimeout(() => {
          navigate(`/restaurant/id/${props?.restaurant_id}`);
          navigate(0);
        }, 1000);
      } else {
        enqueueSnackbar("You haven't login yet", { variant: "error" });
        props.setShow(false);
        setTimeout(() => {
          navigate(`/restaurant/id/${props?.restaurant_id}`);
          navigate(0);
        }, 1000);
      }

      setTimeout(() => {
        closeSnackbar();
      }, 2000);
    },
    [navigate, user?.user_id, props, dispatch]
  );

  return props.show ? (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      <div className="relative w-1/4 min-w-[400px] my-6 mx-auto z-40">
        <div
          className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
          ref={props.formRef}
        >
          <div className="flex items-center justify-between p-2 px-4 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-lg font-semibold">Create New Review</h3>
            <button
              className="p-2 ml-auto text-black float-right text-3xl leading-none font-semibold outline-none rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={() => props.setShow(false)}
            >
              <span className="bg-transparent text-black text-2xl block outline-none focus:outline-none">
                <IoClose size={20} />
              </span>
            </button>
          </div>
          <div className="relative p-6 flex flex-col items-center gap-6 overflow-auto">
            <form
              className="w-full gap-2 flex flex-col"
              onSubmit={handleSubmit((review) => createNewReview(review))}
            >
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Title"
                    type="text"
                    placeholder="Title"
                  />
                )}
              />
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <TextareaInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Content"
                    type="text"
                    placeholder="Type something"
                    className="border border-gray-400 rounded-md p-2 text-sm"
                  />
                )}
              />
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <NumberInput
                    label="Rating"
                    step="1"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="rating from 1 to 5"
                    min={1}
                    max={5}
                  />
                )}
              />
              <Controller
                control={control}
                name="spending"
                render={({ field }) => (
                  <NumberInput
                    label="Spending"
                    step="10"
                    placeholder="How much did you spend?"
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    max={10000}
                  />
                )}
              />
              <Controller
                control={control}
                name="visit_date"
                render={({ field }) => (
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Visit Date"
                    type="date"
                    placeholder=""
                  />
                )}
              />
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <FileInput
                    onChange={(e) => {
                      if (e.target.files) {
                        const selectedFile = e.target.files[0];
                        field.onChange(selectedFile);
                      }
                    }}
                    label="Upload Photo"
                    type="file"
                    className="form-control"
                    placeholder=""
                  />
                )}
              />
              <button
                type="submit"
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-1 px-4 mt-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CreateReviewModal;
