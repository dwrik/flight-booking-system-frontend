import { useState } from 'react'
import Head from 'next/head'
import Flights from '@/components/flights'
import flightService from '@/services/flight.service'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function FlightPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [flights, setFlights] = useState([])

  function handleSubmit(event) {
    event.preventDefault()
    flightService.getFlights(from, to, date)
      .then((flights) => setFlights(flights))
      .catch((error) => console.error(error))
  }

  const handleFromChange = (event) => setFrom(event.target.value)
  const handleToChange = (event) => setTo(event.target.value)
  const handleDateChange = (event) => setDate(event.target.value)

  return (
    <>
      <Head>
        <title>Flight Booking System - Flights</title>
        <meta name="description" content="A Flight Booking System application built using Nextjs & Spring Cloud" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='container d-flex flex-column align-items-center mt-4 pt-4'>
        <h1 className="heading boldest col">Flights</h1>
        <div className='col mt-4'>
          <form className='row-6 input-group mt-4' onSubmit={handleSubmit}>
            <input type='text' aria-label='From Location' className='form-control' placeholder='From' value={from} onChange={handleFromChange} required />
            <input type='text' aria-label='To Location' className='form-control' placeholder='To' value={to} onChange={handleToChange} required />
            <input type='date' aria-label='Date Of Travel' className='form-control' placeholder='Date' value={date} onChange={handleDateChange} required />
            <input type='submit' className='btn btn-dark' value='Search' />
          </form>
          {flights.length == 0 ? null : <Flights flights={flights} hasBookingAction={true} />}
        </div>
      </main>
    </>
  )
}
