'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiClock } from 'react-icons/hi'
import { BiSupport } from 'react-icons/bi'

const PaymentPendingContent = () => {
    const searchParams = useSearchParams()
    const [courseId, setCourseId] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = searchParams.get('courseId')
        if (id) {
            setCourseId(id)
        }
        setLoading(false)
    }, [searchParams])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-yellow-500/20 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-orange-500/20 to-transparent blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center space-y-6">
                        {/* Pending Icon */}
                        <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto flex items-center justify-center">
                            <HiClock className="w-12 h-12 text-yellow-500 animate-pulse" />
                        </div>

                        {/* Pending Message */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-yellow-400">الدفع قيد المراجعة</h1>
                            <p className="text-lg text-gray-300">
                                تم استلام طلب الدفع وهو الآن قيد المراجعة والتأكيد
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="bg-yellow-500/10 rounded-xl p-6">
                            <h3 className="text-lg font-medium mb-4">ماذا يحدث الآن؟</h3>
                            <div className="space-y-3 text-sm text-right">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                    <div>
                                        <p className="font-medium">معالجة الدفع</p>
                                        <p className="text-gray-400">يتم الآن التحقق من عملية الدفع مع البنك</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                    <div>
                                        <p className="font-medium">تأكيد العملية</p>
                                        <p className="text-gray-400">سيتم إرسال تأكيد بالبريد الإلكتروني عند اكتمال العملية</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                    <div>
                                        <p className="font-medium text-gray-400">تفعيل الكورس</p>
                                        <p className="text-gray-500">سيتم تفعيل الكورس فور تأكيد الدفع</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Estimate */}
                        <div className="bg-blue-500/10 rounded-xl p-4">
                            <p className="text-sm text-blue-400">
                                ⏱️ متوسط وقت المراجعة: 5-15 دقيقة
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <Link href="/profile?tab=my-courses">
                                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium rounded-xl py-4 transition-all duration-300">
                                    تحقق من كورساتي
                                </button>
                            </Link>
                            <Link href="/">
                                <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 transition-all duration-300">
                                    العودة للصفحة الرئيسية
                                </button>
                            </Link>
                        </div>

                        {/* Support Info */}
                        <div className="bg-gray-500/10 rounded-xl p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <BiSupport className="text-gray-400 text-xl" />
                                <h4 className="text-gray-400 font-medium">لم يتم تأكيد الدفع بعد؟</h4>
                            </div>
                            <p className="text-sm text-gray-300">
                                إذا لم يتم تأكيد الدفع خلال 30 دقيقة، تواصل معنا عبر الواتساب: 
                                <a href="https://wa.me/201032714327" className="text-blue-400 hover:text-blue-300 mr-2">
                                    01032714327
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentPending = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
            </div>
        }>
            <PaymentPendingContent />
        </Suspense>
    )
}

export default PaymentPending
