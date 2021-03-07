import HttpResource from "./http-resource";
import { httpVideo } from ".";

const httpGenre = new HttpResource(httpVideo, "genres");

export default httpGenre;
