import { httpVideo as http } from ".";
import HttpResource from "./http-resource";

const httpVideo = new HttpResource(http, "videos");

export default httpVideo;
