@component('mail::message')
# Appointment Status Updated

Your appointment (ID: {{ $appointment->appointment_id }}) status has been changed to **{{ $appointment->status }}**.

@component('mail::button', ['url' => url('/appointments/'.$appointment->id)])
View Appointment
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
