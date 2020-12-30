import { httpVideo } from ".";
import HttpResource from "./http-resource";

const httpCastMember = new HttpResource(httpVideo, "cast_members");

export default httpCastMember;
