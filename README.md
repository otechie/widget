# Otechie Live Chat Widget

![image](https://user-images.githubusercontent.com/16690226/135666011-676b95b0-c83d-4cb7-8fab-560d0bb2f5de.png)


## Installation 
Paste the code below before the </head> tag on your website where you want the contact widget to appear. Check out the documentation to see how to control the contact widget and bubble.
```
<script>
    // We pre-filled your account id in the widget code below: '5cb73b39df75b2a1b2b6263f'
    (function(w,d,s,o,f,js,fjs,l){w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};l=function(){js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.type='text/javascript';js.async=1;fjs.parentNode.insertBefore(js,fjs)};if(w.attachEvent){w.attachEvent('onload',l)}else{w.addEventListener('load',l,false)}}(window,document,'script','Otechie','https://widget.otechie.com/widget.js'));
    Otechie('init', { account: 'ACCOUNT_ID' });
</script>
```

You can find the code with your ACCOUNT_ID prefilled at at https://app.otechie.com/c#widget or by going to Settings > Chat Widget.


## API 
### Otechie('init',  { settings })
If you'd like to control when Otechie is loaded, you can use the 'init' method. You can call this method with your account's id.
```
Otechie('init', { account: 'ACCOUNT_ID' });
```

### Otechie('hide')
This will hide the chat bubble and close the start conversation panel if it is open.
```
Otechie('hide');
```

### Otechie('show')
This will show the chat bubble if it is hidden.
```
Otechie('show');
```

### Otechie('close')
This will close the start conversation panel if it is open. It will not hide the chat bubble.
```
Otechie('close');
```


### Otechie('open')
This will open the start conversation panel if it is closed.
```
Otechie('open');
```
