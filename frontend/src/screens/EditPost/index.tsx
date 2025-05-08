import { FormEvent, useEffect, useState } from "react";
import cn from "classnames";
import toast from "react-hot-toast";
import styles from "./EditPost.module.sass";

import { editPost } from "../../redux/posts/post.thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectIsLogining,
  selectUserError,
  selectPostToEdit,
} from "../../redux/selectors";
import { kitsConstant } from "../../constants/kits.constant";
import { filterConstant } from "../../constants/filter.constant";

import { setArrayString } from "../../helpers/categoryKitSetArray";
import Preview from "../../components/PreviewPost/PreviewPost";
import Icon from "../../components/Icon";
import Loader from "../../components/Loader";
import PostFormFields from "../../components/UploadForm/PostFormFields";
import SwitchSelector from "../../components/UploadForm/SwitchSelector";
import { setPostToEdit } from "../../redux/posts/postSlice";
import Control from "../../components/Control";
import { useNavigate } from "react-router-dom";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Post",
  },
];

const EditPost = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const post = useAppSelector(selectPostToEdit);

  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);

  const [isUploading, setIsUploading] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);

  const [titleValue, setTitleValue] = useState<string>(post?.title || "");
  const [descriptionValue, setDescriptionValue] = useState<string>(
    post?.description || ""
  );
  const [previews, setPreviews] = useState<string[] | null>(
    post?.images || null
  );
  const [uploadAt, setUploadAt] = useState<string>(post?.upload_at || "");
  const [kitState, setKitState] = useState(
    kitsConstant.map((key) => ({
      [key]: post?.kits.includes(key) ? true : false,
    }))
  );
  const [categoryState, setCategoryState] = useState(
    filterConstant.map((key) => ({
      [key]: post?.category.includes(key) ? true : false,
    }))
  );

  useEffect(() => {
    dispatch(setPostToEdit(post));
    return () => {
      dispatch(setPostToEdit(null));
    };
  }, [dispatch, post]);

  const undo = () => {
    setTitleValue(post?.title || "");
    setDescriptionValue(post?.description || "");
    setKitState(
      kitsConstant.map((key) => ({
        [key]: post?.kits.includes(key) ? true : false,
      }))
    );
    setCategoryState(
      filterConstant.map((key) => ({
        [key]: post?.category.includes(key) ? true : false,
      }))
    );
    setUploadAt(post?.upload_at || "");
    setIsUploading(false);
  };

  const reset = () => {
    setTitleValue("");
    setDescriptionValue("");
    setKitState(
      kitsConstant.map((key) => ({
        [key]: false,
      }))
    );
    setCategoryState(
      filterConstant.map((key) => ({
        [key]: false,
      }))
    );
    setUploadAt("");
    setIsUploading(false);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const category = setArrayString(categoryState);
    const kits = setArrayString(kitState);

    try {
      switch (true) {
        case !titleValue:
          toast.error("Title is required");
          return;
        case !descriptionValue:
          toast.error("Description is required");
          return;
        case !uploadAt:
          toast.error("Upload set date is required");
          return;
        case kits.length === 0:
          toast.error("Kit is required");
          return;
        case category.length === 0:
          toast.error("Filter category is required");
          return;
        default:
      }
    } finally {
      if (
        !titleValue ||
        !descriptionValue ||
        !uploadAt ||
        kits.length === 0 ||
        category.length === 0
      ) {
        setIsUploading(false);
      }
    }

    const data = {
      title: titleValue,
      images: previews?.map((url) => url.split("?")[0]) || [],
      description: descriptionValue,
      category,
      kits,
      upload_at: uploadAt,
    };

    const resultAction = await dispatch(
      editPost({ post: data, postId: post?._id || "" })
    );

    if (editPost.fulfilled.match(resultAction)) {
      toast.success("Post edited!");
      reset();
      navigate(`/post/${post?._id}`);
    } else if (editPost.rejected.match(resultAction)) {
      toast.error("Edit post failed");
      setIsUploading(false);
    }

    if (error) {
      toast.error(error);
      console.error(error);
    }

    setIsUploading(false);
  };

  const moveImagePreview = (indexStart: number, indexEnd: number) => {
    if (previews) {
      setPreviews((prevPreviews) => {
        if (!prevPreviews) return prevPreviews;

        const newPreviews = [...prevPreviews];

        const [movedPreview] = newPreviews.splice(indexStart, 1);
        newPreviews.splice(indexEnd, 0, movedPreview);

        return newPreviews;
      });
    }
  };

  return (
    <>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <h1 className={cn("h2", styles.title)}>Update post</h1>
            </div>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.list}>
                <PostFormFields
                  titleValue={titleValue}
                  onTitleChange={(e) => setTitleValue(e.target.value)}
                  descriptionValue={descriptionValue}
                  onDescriptionChange={(e) =>
                    setDescriptionValue(e.target.value)
                  }
                  uploadAt={uploadAt}
                  onUploadAtChange={(value) => setUploadAt(value)}
                />

                <SwitchSelector
                  title="Kits"
                  items={kitState}
                  setItems={setKitState}
                  constants={kitsConstant}
                  containerClass={styles.options}
                  optionClass={styles.option}
                />
                <SwitchSelector
                  title="Filter"
                  items={categoryState}
                  setItems={setCategoryState}
                  constants={filterConstant}
                  containerClass={styles.filteroptions}
                  optionClass={styles.filteroption}
                  showBox={true}
                />
              </div>

              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                <button
                  className={cn("button", styles.button)}
                  type="submit"
                  disabled={isLoading || isUploading}
                >
                  {isLoading || isUploading ? (
                    <Loader className="" />
                  ) : (
                    <>
                      <span>Update post</span>
                      <Icon title="arrow-next" size={10} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            moveImagePreview={moveImagePreview}
            previews={previews}
            reset={reset}
            undo={undo}
            title={titleValue}
            desc={descriptionValue}
            kits={kitState}
            category={categoryState}
            fileSize={post ? parseInt(post?.filesize) : undefined}
            uploadAt={uploadAt}
          />
        </div>
      </div>
    </>
  );
};

export default EditPost;
