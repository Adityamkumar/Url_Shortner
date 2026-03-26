import { RESERVED_ALIASES } from "../../config/constants.js";
import { UrlModel } from "../../models/url.model.js";
import { ApiError } from "../ApiError.js";

export const validateAlias = async(customAlias?: string) => {

  if (customAlias) {
    const isValid = /^[a-zA-Z0-9_-]+$/.test(customAlias);
    if (!isValid) {
      throw new ApiError(400, "Invalid custom alias format");
    }

    if (customAlias && customAlias.length > 20) {
      throw new ApiError(400, "Alias is too long, max length should be 20.");
    }
    if (customAlias && RESERVED_ALIASES.includes(customAlias)) {
      throw new ApiError(409, "Alias is not allowed");
    }
    const existingAlias = await UrlModel.findOne({ shortId: customAlias });
    if (existingAlias) {
      throw new ApiError(409, "Alias already taken");
    }
  }
};
