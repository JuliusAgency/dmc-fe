export const HomeEndpoints = {
  getHomeImages: "/home/home-images",
  addHomeImage: "/home/home-images/add",
  addHomeAnnouncement: "/home/home-announcements/add",
  getHomeAnnouncements: "/home/home-announcements",
  deleteHomeAnnouncement: (id: number) => `/home/home-announcements/${id}`,
};
