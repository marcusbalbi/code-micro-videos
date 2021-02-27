import { AxiosError } from "axios";
import { Video } from "../../util/dto";

interface FileUpload {
  fileField: string; //Thumb, Banner, Video etc
  filename: string;
  progress: number;
  error?: AxiosError;
}

interface Upload {
  video: Video;
  progress: number;
  files: FileUpload[];
}

interface UploadCollectionState {
  uploads: Upload[];
}

export {}
