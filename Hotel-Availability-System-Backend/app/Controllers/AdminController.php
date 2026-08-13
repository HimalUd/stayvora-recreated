<?php
require_once __DIR__ . '/../Core/Controller.php';
require_once __DIR__ . '/../Models/Hotel.php';
require_once __DIR__ . '/../Models/Booking.php';
require_once __DIR__ . '/../Models/Review.php';

class AdminController extends Controller {
    private Hotel $hotelModel;
    private Booking $bookingModel;
    private Review $reviewModel;

    public function __construct() {
        parent::__construct();
        $this->hotelModel = new Hotel();
        $this->bookingModel = new Booking();
        $this->reviewModel = new Review();
    }

    public function hotels(): void {
        $this->requireAdmin();
        $hotels = $this->hotelModel->getAdminHotelList();
        $this->json(["hotels" => $hotels]);
    }

    public function stats(): void {
        $this->requireAdmin();
        $totalHotels = (int)$this->hotelModel->query("SELECT COUNT(*) as c FROM hotels")->fetch()['c'];
        $totalBookings = (int)$this->hotelModel->query("SELECT COUNT(*) as c FROM bookings")->fetch()['c'];
        $totalReviews = (int)$this->hotelModel->query("SELECT COUNT(*) as c FROM reviews")->fetch()['c'];
        $flagged = $this->hotelModel->query(
            "SELECT COUNT(*) as c FROM hotels WHERE rating < 3"
        )->fetch()['c'];

        $this->json([
            "stats" => [
                "total_hotels" => $totalHotels,
                "total_bookings" => $totalBookings,
                "total_reviews" => $totalReviews,
                "flagged_hotels" => (int)$flagged,
            ]
        ]);
    }

    public function bookings(): void {
        $this->requireAdmin();
        $bookings = $this->bookingModel->fetchAll(
            "SELECT b.*, h.name as hotel_name, u.name as user_name
             FROM bookings b
             JOIN hotels h ON b.hotel_id = h.id
             JOIN users u ON b.user_id = u.id
             ORDER BY b.created_at DESC
             LIMIT 5"
        );
        $this->json(["bookings" => $bookings]);
    }

    public function reviews(): void {
        $this->requireAdmin();
        $reviews = $this->reviewModel->fetchAll(
            "SELECT r.*, h.name as hotel_name, u.name as user_name
             FROM reviews r
             JOIN hotels h ON r.hotel_id = h.id
             JOIN users u ON r.user_id = u.id
             ORDER BY r.created_at DESC"
        );
        $this->json(["reviews" => $reviews]);
    }

    public function deleteHotel(): void {
        $this->requireAdmin();
        $input = $this->getJsonInput();
        $id = $input['id'] ?? $_GET['id'] ?? null;

        if (!$id || !is_numeric($id)) {
            $this->json(["message" => "Hotel ID is required"], 400);
        }

        $id = (int)$id;
        $hotel = $this->hotelModel->findById($id);
        if (!$hotel) {
            $this->json(["message" => "Hotel not found"], 404);
        }

        try {
            $this->hotelModel->beginTransaction();
            $this->hotelModel->query("DELETE FROM hotel_images WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM bookings WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM rooms WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM events WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM special_offers WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM nearby_places WHERE hotel_id = ?", [$id]);
            $this->hotelModel->query("DELETE FROM hotels WHERE id = ?", [$id]);
            $this->hotelModel->commit();
            $this->json(["message" => "Hotel deleted successfully by admin"]);
        } catch (Exception $e) {
            $this->hotelModel->rollBack();
            $this->json(["message" => "Failed to delete hotel"], 500);
        }
    }
}