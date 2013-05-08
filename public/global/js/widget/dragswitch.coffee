KISSY.add "widget/dragswitch", (S, Node, Event, UA, SSlog) ->

  $ = KISSY.all
  defaultConfig =
    senDistance: 6
    angle: Math.PI / 4
    checkvalid: null
    inertiaMove: false
    disable    : false
    binds: [null, null, null, null,
            moveSelf: true
            moveEls: []
            maxDistance: 99999    # 注意正负值
            validDistance: null   # 注意正负值
            passCallback: null
            failCallback: null
            checkvalid: null
    ]
  # 最后一个只是例子，其实完全没用处，顺序按 up, right, down, left

  class DragSwitch

    constructor: (@el, @config)->
      S.mix @, S.EventTarget
      @init()

    init: ->
      @config = S.merge(defaultConfig, @config)
      @disable = @config.disable
      @isSelector = true if typeof @el is "string"
      @el = $(@el) if !@isSelector
      @realEl = $ @el
      @tanAngel = Math.tan(@config.angle)
      @effectEls = []
      for item in @config.binds
        continue if !item
        item.moveSelf = true if !item.moveSelf?
        @effectEls.push $(el) for el in item.moveEls
      @bindEvents()

    bindEvents: ->
      if @isSelector
        $('body').delegate "touchstart", @el, (ev) => @touchStart(ev)
        $('body').delegate "touchmove", @el, (ev) => @touchMove(ev)
        $('body').delegate "touchend", @el, (ev) => @touchEnd(ev)
      else
        @el.on "touchstart", (ev) => @touchStart(ev)
        @el.on "touchmove", (ev) => @touchMove(ev)
        @el.on "touchend", (ev) => @touchEnd(ev)

    touchStart: (e)->
      @stopInertiaMove = true
      return if @disable
      @enabled = if @config.checkvalid then @config.checkvalid() else true # 外部检查
      return if !@enabled
#      e.halt() if @isSendStart
      e.preventDefault()
      ev = e.originalEvent
      @istouchStart = true
      @isSendStart = false
      @eventType = null
      @key = null
      @actuMoveEls = []
      @startPoint = [ev.touches[0].pageX, ev.touches[0].pageY]
      @lastPoint = @startPoint.slice()
      @yesterPoint = @lastPoint.slice()
#      for item in @config.binds
#        if item && !item.moveEls.join("")
#          item.moveEls = if @isSelector && parent = $(ev.target).parent(@el) then [parent] else [$(ev.target)]
#      @effectEls = item.moveEls
#      @effectEls.push(if @isSelector && parent = $(ev.target).parent(@el) then parent else $(ev.target)) if
      @effectEls.push @originalEl = if @isSelector && parent = $(ev.target).parent(@el) then parent else $(ev.target)
      @saveMatrixState @effectEls  #originalEl

    touchMove: (e)->
      return if !@istouchStart
      return if @isSendStart && !@effectBind
#      console.log "get in touchmove"
      ev = e.originalEvent
      point = [ev.touches[0].pageX, ev.touches[0].pageY]
      oPoint = @startPoint
      angleDelta = Math.abs((oPoint[1] - point[1]) / (point[0] - oPoint[0])) # 这是水平方向的
      distance = [point[0] - oPoint[0], point[1] - oPoint[1]]
#      maxDistance = Math.max(Math.abs(distance[0]), Math.abs(distance[1]))
      if !@isSendStart and angleDelta > @tanAngel and 1 / angleDelta > @tanAngel
        @istouchStart = false
        return
      else if !@eventType # && maxDistance >= @config.senDistance
#        console.log "recalting eventType", e.target.className, e.currentTarget.className
        if angleDelta <= @tanAngel && Math.abs(distance[0]) > @config.senDistance # 水平
          @eventType = (if distance[0] > 0 then "dragRight" else "dragLeft")
        else if 1 / angleDelta <= @tanAngel && Math.abs(distance[1]) > @config.senDistance # 垂直
          @eventType = (if distance[1] > 0 then "dragDown" else "dragUp")
        else
          return
#        console.log "eventType is ", @eventType, e.target.className, e.currentTarget.className
        @key = (if @eventType is "dragDown" then 0 else (if @eventType is "dragLeft" then 1 else (if @eventType is "dragUp" then 2 else (if @eventType is "dragRight" then 3 else null))))
        @isVertical = 1 - @key % 2
        @effectBind = @config.binds[@key]
        return if !@effectBind
        @moveEls = @effectBind.moveEls
        @actuMoveEls = @moveEls.slice()
        @actuMoveEls.push @originalEl if @effectBind.moveSelf
        @saveMatrixState @actuMoveEls
        @enabled = if @effectBind.checkvalid then @effectBind.checkvalid(S.mix(e, {self: @})) else true # 内部检查
        # 记录初始时间
        @startTime = new Date
        $("body").addClass "dragswitch-dragging"
#      console.log "will run in"
      return if !@eventType or !@enabled or !@effectBind
#      console.log "just run in"
      e.stopPropagation()
      if !@isSendStart
        @isSendStart = true
        @fire @eventType + "Start", S.mix(e, self: @)
      @fire @eventType, S.mix(e, self: @)
      if !e.isDefaultPrevented()
        @move point
      @yesterPoint = @lastPoint.slice()
      @yesterTime = new Date(@lastTime)
      @lastPoint = point.slice()
      @lastTime = new Date

    touchEnd: (e)->
      $("body").removeClass "dragswitch-dragging"
      return if !@eventType or !@enabled or !@effectBind
      if @istouchStart and @isSendStart
        if !@config.inertiaMove
          @touchEndHandler(e)
        else
          v = (@yesterPoint[@isVertical] - @lastPoint[@isVertical]) / (@yesterTime - @lastTime)
          dir = (if v > 0 then -1 else 1)
          deceleration = dir * 0.01
          duration = Math.abs(v / deceleration)
          dist = v * duration
#          console.log duration, dist
          @stopInertiaMove = false
          @inertiaMove(el, duration, dist) for el in @actuMoveEls # 惯性滚动部分还是没做好
          setTimeout =>
            @touchEndHandler.call @, e
          , duration

      @istouchStart = false
      @isSendStart = false
      @eventType = null

    touchEndHandler: (e)->
      @fire @eventType + "End", S.mix(e, self: @)
      obj = @effectBind
      if Math.abs(@distance) >= Math.abs(obj.validDistance)
        if obj.passCallback
          obj.passCallback.call e.target, S.mix(e, self: @)
        else
          # 复原
          @restoreMatrixState()
#      @restoreMatrixState()

    saveMatrixState: (els)->
      for el in els
        el.matrixState = @getMatrix el

    getMatrix: (el)->
      $(el).css("-webkit-transform") or
      $(el).css("-o-transform") or
      $(el).css("-moz-transform") or
      $(el).css("transform")

    setMatrix: (el, matrix)->
      $(el).css
        "transform"         : matrix
        "-webkit-transform" : matrix
        "-ms-transform"     : matrix
        "-o-transform"      : matrix

    restoreMatrixState: ->
      for el in @effectEls
        @setMatrix el, el.matrixState

    move: (endPoint)->
#      key = @key
      startPoint = @startPoint
      lastPoint = @lastPoint
      rawDistance = @distance = (if @isVertical then endPoint[1] - startPoint[1] else endPoint[0] - startPoint[0])
      positiveDirt = @key is 0 or @key is 3
      backward = if positiveDirt then rawDistance < 0 else rawDistance > 0

      # 摩擦力效果
      if @effectBind.maxDistance && Math.abs(rawDistance) > Math.abs(@effectBind.maxDistance)
        dis = Math.sqrt(Math.abs(rawDistance - @effectBind.maxDistance) * 5)
        dis = -dis if !positiveDirt
        rawDistance = @distance = @effectBind.maxDistance + dis

      for el in @actuMoveEls
        @setMatrix el, @translate(el.matrixState, rawDistance, !@isVertical)

    translate: (currentMatrix, distance, hori)->
      matrix = @parseMartix currentMatrix
      matrix[4] += distance * hori
      matrix[5] += distance * (1 - hori)
      "matrix(" + matrix.join(',') + ")"
#      if UA.webkit
#        (new WebKitCSSMatrix(currentMatrix)).translate(distance * hori, distance * (1 - hori)).toString()

    parseMartix: (currentMatrix)->
      matrix = currentMatrix.match /[0-9\.\-]+/g
      matrix = [1,0,0,1,0,0] if !matrix
      matrix.forEach (item, key)-> matrix[key] = parseFloat(item)
      return matrix

    inertiaMove: (el, duration, dist)->
       currentMatrix = @getMatrix el
       newMatrix = @translate currentMatrix, dist, 1 - @isVertical
       transition = "-webkit-transform " + duration.toString().slice(0,4) + "ms cubic-bezier(1, 0, .92, 0)"
       $(el).css "-webkit-transition", transition
       @setMatrix el, newMatrix
       setTimeout =>
         $(el)[0].style.webkitTransition = ""
       , duration


,
  requires: ["node", "event", "ua", "widget/sslog"]