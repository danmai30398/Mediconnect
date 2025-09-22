<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentStatusChanged extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[MediConnect Group] Appointment Status',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.appointment.status_changed',
            with: [
                'appointment' => $this->appointment,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
