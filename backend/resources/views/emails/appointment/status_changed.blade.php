@component('mail::message')
# Appointment Status Updated

<div>
@if($appointment->status == 'pending')
    Your appointment request has been received successfully. Our staff will review it and provide confirmation shortly.
@elseif($appointment->status == 'confirmed')
    Your appointment has been confirmed by the doctor. We look forward to seeing you at the scheduled time.
@elseif($appointment->status == 'cancelled_by_doctor')
    We regret to inform you that your appointment has been cancelled by the doctor. Please contact us if you wish to reschedule.
@elseif($appointment->status == 'cancelled_by_patient')
    Your appointment has been cancelled as per your request. If you would like to book a new appointment, please do not hesitate to contact us.
@endif
</div>

<h1 style="text-align: center;">Appointment Details</h1>
<p style="text-align: center;">Doctor: {{ $appointment->availability->doctor->name }}</p>
<p style="text-align: center;">Branch: {{ $appointment->availability->doctor->city->city_name }}</p>
<p style="text-align: center;">Date: {{ $appointment->availability->available_date }}</p>
<p style="text-align: center;">Time: {{ $appointment->availability->available_time }}</p>
<p style="text-align: center;">Status: {{ $appointment->status }}</p>

---

**Thank you for choosing {{ config('app.name') }}.**  
We are committed to providing you with the best possible care.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
