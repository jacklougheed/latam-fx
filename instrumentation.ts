// Runs once when the server process starts. Kicks off the background rate
// refresher so data is fetched on boot and then every REFRESH_INTERVAL_MINUTES.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startBackgroundRefresh } = await import("./lib/rates");
    startBackgroundRefresh();
  }
}
