import React from 'react';
import Link from 'next/link';
export default function SearchUsers() {
    return (
    <>
    Search for users to chat with
    <Link href="/drivers">Drivers</Link>
    or 
    <Link href="/car-owners">Car Owners</Link>
    </>
  )
}