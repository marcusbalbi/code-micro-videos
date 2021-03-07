import HttpResource from "./http-resource";
import { httpVideo as http } from ".";

const httpVideo = new HttpResource(http, "videos");

export default httpVideo;
