import {
  apiNotFound,
  authenticateAdmin,
  deleteMenuImage,
  getMenu,
  getMenuImage,
  methodNotAllowed,
  saveMenuOrder,
  uploadMenuImage,
} from "./menu.js"
import { sendCateringEnquiry } from "./catering.js"

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/"

    if (pathname === "/api/menu") {
      if (request.method === "HEAD") return authenticateAdmin(request, env)
      if (request.method === "GET") return getMenu(env)
      if (request.method === "POST") return uploadMenuImage(request, env)
      if (request.method === "DELETE") return deleteMenuImage(request, env)
      return methodNotAllowed(["HEAD", "GET", "POST", "DELETE"])
    }

    if (pathname === "/api/menu/order") {
      if (request.method === "PUT") return saveMenuOrder(request, env)
      return methodNotAllowed(["PUT"])
    }

    if (pathname === "/api/menu/image") {
      if (request.method === "GET") return getMenuImage(request, env)
      return methodNotAllowed(["GET"])
    }

    if (pathname === "/api/catering-enquiry") {
      if (request.method === "POST") return sendCateringEnquiry(request, env)
      return methodNotAllowed(["POST"])
    }

    if (pathname.startsWith("/api/")) return apiNotFound()
    return env.ASSETS.fetch(request)
  },
}
