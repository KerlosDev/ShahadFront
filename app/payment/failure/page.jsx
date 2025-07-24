'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiXCircle } from 'react-icons/hi'
import { BiSupport } from 'react-icons/bi'

const PaymentFailureContent = () => {
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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-red-500/20 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-orange-500/20 to-transparent blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center space-y-6">
                        {/* Failure Icon */}
                        <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
                            <HiXCircle className="w-12 h-12 text-red-500" />
                        </div>

                        {/* Failure Message */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-red-400">فشل في عملية الدفع</h1>
                            <p className="text-lg text-gray-300">
                                عذراً، لم تتم عملية الدفع بنجاح. يرجى المحاولة مرة أخرى
                            </p>
                        </div>

                        {/* Reasons */}
                        <div className="bg-red-500/10 rounded-xl p-6 text-right">
                            <h3 className="text-lg font-medium mb-4 text-center">الأسباب المحتملة:</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    رصيد غير كافي في البطاقة أو المحفظة الإلكترونية
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    انتهاء صلاحية البطاقة أو بيانات خاطئة
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    مشكلة تقنية مؤقتة في نظام الدفع
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    إلغاء العملية من قبل المستخدم
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {courseId && (
                                <Link href={`/payment/${courseId}`}>
                                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl py-4 transition-all duration-300">
                                        المحاولة مرة أخرى
                                    </button>
                                </Link>
                            )}
                            <Link href="/">
                                <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 transition-all duration-300">
                                    العودة للصفحة الرئيسية
                                </button>
                            </Link>
                        </div>

                        {/* Support Info */}
                        <div className="bg-blue-500/10 rounded-xl p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <BiSupport className="text-blue-400 text-xl" />
                                <h4 className="text-blue-400 font-medium">تحتاج مساعدة؟</h4>
                            </div>
                            <p className="text-sm text-gray-300">
                                تواصل معنا عبر الواتساب: 
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

const PaymentFailure = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    )
}

export default PaymentFailure
