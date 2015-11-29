<!DOCTYPE html>
<html>
	<head>
		<style>
		body{
			font-family: 'verdana', sans-serif;
		}
		.e-ticket-content{
			clear: both;
            padding: 0 0;
		}
		.e-ticket-content-owner{
			text-align: center;
			width: 50%;
			float: left;
		}
		.e-ticket-content-owner{
			width: 50%;
			float: left;
		}
        .e-ticket-content-qrcode{
            display: block;
            width: 7cm;
        }
        .e-ticket-content-info{
            padding-top: 0.6cm;
        }
        .e-ticket-info{
            padding-top: 0.3cm;
        }
		</style>
	</head>
	<body>
	<div class="e-ticket-header">
		<img src="/app/img/e_ticket-head.png">
	</div>
	<div class="e-ticket-content">
		<div class="e-ticket-content-owner">
			<img class="e-ticket-content-qrcode" src="/api/ticket/png/?ticket=<?= $ticket->ticket; ?>">
		</div>
		<div class="e-ticket-content-info">
            <img src="/app/img/e_ticket-lineup.png">
		</div>
	</div>
	<div class="e-ticket-footer">
		<img src="/app/img/e_ticket-footer.png">
	</div>
    <div class="e-ticket-info">
        <img src="/app/img/e_ticket-info_horizontal.png">
    </div>
	</body>
</html>