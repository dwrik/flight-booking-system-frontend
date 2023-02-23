import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import Head from "next/head"
import Bookings from "@/components/bookings"
import bookingService from "@/services/booking.service"
import checkinService from "@/services/checkin.service"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function BookingsPage(props) {
    const [bookings, setBookings] = useState(props.bookings)

    const handleCheckinClick = ({ target }) => {
        const checkedIn = target.parentElement.previousElementSibling.innerText === 'Yes' ? true : false
        const id = Number(target.getAttribute('data-id'))

        if (checkedIn) {
            toast.error('Already checked-in!')
            return
        }

        checkinService.checkin(id)
            .then(({ checkinStatus, seatNumber }) => {
                const updated = bookings.map((booking) => {
                    return booking.id !== id
                        ? booking : { ...booking, checkinStatus, seatNumber }
                })
                setBookings(updated)
                toast.success('Checked-in successfully!')
            })
            .catch((error) => console.error(error))
    }

    const handleDeleteClick = (event) => {
        const id = Number(event.target.getAttribute('data-id'))
        bookingService.deleteBooking(id)
            .then((data) => {
                const filtered = bookings.filter((booking) => booking.id !== id)
                setBookings(filtered)
                toast.success('Booking deleted successfully!')
            })
            .catch((error) => console.log(error))
    }

    return (
        <>
            <Head>
                <title>Flight Booking System - Bookings</title>
                <meta name="description" content="A Flight Booking System application built using Nextjs & Spring Cloud" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='container d-flex flex-column align-items-center mt-4 pt-4'>
                <h1 className="heading boldest">Bookings</h1>
                <Toaster position="top-right" />
                {bookings === null
                    ? <p className="fs-5 mt-4">Please login to access this page</p>
                    : <Bookings
                        bookings={bookings}
                        handleCheckinClick={handleCheckinClick}
                        handleDeleteClick={handleDeleteClick}
                    />
                }
            </main>
        </>
    )
}

export async function getServerSideProps(context) {
    try {
        const bookings = await bookingService.getBookings()
        return { props: { bookings } }
    } catch (error) {
        return { props: { bookings: null } }
    }
}
