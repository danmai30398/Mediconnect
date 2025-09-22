@component('mail::message')
<!-- # Appointment is coming -->

<div style="font-family: Arial, sans-serif; line-height: 1.6;">

    <p>Dear {{ $appointment->patient->name }},</p>

    <p>
        This is a friendly reminder that you have a medical appointment scheduled for
        <strong>{{ $appointment->availability->available_date }}</strong>
        at <strong>{{ \Carbon\Carbon::parse($appointment->availability->available_time)->format('H:i') }}</strong>
        with Dr. {{ $appointment->availability->doctor->name }}
        at branch: {{ $appointment->availability->doctor->city->city_name }}.
    </p>

    <p>
        If you have any questions, please contact us at
        <strong>contact@mediconnect.com</strong>.
    </p>

    <p>We look forward to seeing you tomorrow.</p>

    ---

    **Thank you for choosing {{ config('app.name') }}.**
    We are committed to providing you with the best possible care.

    <p>Best regards,<br>
        {{ config('app.name') }}
    </p>

</div>
@endcomponent