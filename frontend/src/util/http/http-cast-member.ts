import HttpResource from "./http-resource";
import { httpVideo } from ".";

const httpCastMember = new HttpResource(httpVideo, "cast_members");

export default httpCastMember;
