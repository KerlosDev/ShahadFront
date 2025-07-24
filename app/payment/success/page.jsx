'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiCheckCircle } from 'react-icons/hi'
import { GiMolecule } from 'react-icons/gi'

const PaymentSuccessContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-green-500/20 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-blue-500/20 to-transparent blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center space-y-6">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
                            <HiCheckCircle className="w-12 h-12 text-green-500" />
                        </div>

                        {/* Success Message */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-green-400">تم الدفع بنجاح!</h1>
                            <p className="text-lg text-blue-400">
                                تهانينا! تم تأكيد عملية الدفع وسيتم تفعيل الكورس خلال دقائق قليلة
                            </p>
                        </div>

                        {/* Course Info */}
                        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6">
                            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                                    <GiMolecule className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">الكورس جاهز للاستخدام</h3>
                                    <p className="text-blue-400 text-sm">مع أ/ حسام ميرة</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300">
                                ستجد الكورس في قسم "كورساتي" ويمكنك البدء في الدراسة فوراً
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <Link href="/profile?tab=my-courses">
                                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl py-4 transition-all duration-300">
                                    انتقل إلى كورساتي
                                </button>
                            </Link>
                            <Link href="/">
                                <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 transition-all duration-300">
                                    العودة للصفحة الرئيسية
                                </button>
                            </Link>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-blue-500/10 rounded-xl p-4">
                            <p className="text-sm text-blue-400">
                                💡 إذا لم تجد الكورس في قسم "كورساتي" خلال 5 دقائق، يرجى التواصل مع الدعم الفني
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentSuccess = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    )
}

export default PaymentSuccess
