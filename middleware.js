import { NextResponse } from 'next/server'
 

export function middleware(request) {
    if(!request.nextUrl.pathname.startsWith('/api/updatedashboard')){
        const {bannerImage, profileImage} = request.body;
    }
}
 
export const config = {
  matcher: '/api/updatedashboard',
}