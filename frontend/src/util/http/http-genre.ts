import { httpVideo } from ".";
import HttpResource from "./http-resource";

const httpGenre = new HttpResource(httpVideo, "genres");

export default httpGenre;
