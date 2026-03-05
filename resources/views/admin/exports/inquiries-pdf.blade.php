<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Inquiries Export</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 10pt;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 18pt;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #999;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Contact Inquiries Export</h1>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Form / Type</th>
                <th>Message & Additional Data</th>
                <th>Status / Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($inquiries as $inquiry)
                <tr>
                    <td>{{ $inquiry->id }}</td>
                    <td>
                        <strong>{{ $inquiry->name }}</strong><br>
                        {{ $inquiry->email }}
                    </td>
                    <td>{{ $inquiry->subject }}</td>
                    <td>
                        <strong>Form:</strong> {{ $inquiry->form_name }}<br>
                        <strong>Type:</strong> {{ ucfirst($inquiry->type) }}
                    </td>
                    <td>
                        <strong>Message:</strong><br>
                        {{ $inquiry->message }}
                        
                        @if(!empty($inquiry->metadata['formatted_fields']))
                            <div style="margin-top: 10px; padding-top: 5px; border-top: 1px solid #eee;">
                                <strong>Additional Fields:</strong><br>
                                @foreach($inquiry->metadata['formatted_fields'] as $label => $value)
                                    <small><strong>{{ $label }}:</strong> {{ is_array($value) ? implode(', ', $value) : $value }}</small><br>
                                @endforeach
                            </div>
                        @endif
                    </td>
                    <td>
                        {{ ucfirst($inquiry->status) }}<br>
                        <small>{{ $inquiry->created_at->format('Y-m-d H:i') }}</small>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Page <span class="pagenum"></span>
    </div>
</body>
</html>
